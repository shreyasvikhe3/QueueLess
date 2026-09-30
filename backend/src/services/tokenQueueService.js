import { store } from '../models/store.js';
import { generateNextTokenNumber } from '../utils/tokenGenerator.js';
import { calculateCrowdDensity } from '../utils/crowdDensityCalc.js';
import { MLIntegrationService } from './mlIntegrationService.js';
import { FCMNotificationService } from './fcmService.js';
import { logger } from '../utils/logger.js';

export class TokenQueueService {
  /**
   * Recalculate queue positions and trigger approaching alerts for all active tokens in a service queue
   */
  static async updateQueuePositions(serviceId) {
    const waitingTokens = store.tokens
      .filter(t => t.serviceId === serviceId && ['WAITING', 'CHECKED_IN'].includes(t.status))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const activeCountersCount = store.counters.filter(
      c => c.status === 'ACTIVE' && store.services.find(s => s.serviceId === serviceId)
    ).length || 1;

    const service = store.services.find(s => s.serviceId === serviceId);
    const avgServiceTime = service ? service.averageServiceTime : 5;

    for (let index = 0; index < waitingTokens.length; index++) {
      const token = waitingTokens[index];
      const newPeopleAhead = index;

      token.peopleAhead = newPeopleAhead;

      // Request prediction update
      const prediction = await MLIntegrationService.predictWaitingTime({
        peopleAhead: newPeopleAhead,
        activeCounters: activeCountersCount,
        averageServiceTime: avgServiceTime,
        queueLength: waitingTokens.length,
        serviceType: service ? service.name : 'General'
      });

      token.estimatedWaitMinutes = prediction.predictedWaitingMinutes;
      token.confidenceRange = prediction.confidenceRange;

      // Trigger turn approaching alert when people ahead drops to 5 or 2
      if (newPeopleAhead === 5 || newPeopleAhead === 2) {
        FCMNotificationService.notifyTurnApproaching(token.userId, token.tokenNumber, newPeopleAhead);
      }
    }
  }

  /**
   * Issue a new virtual token for a user
   */
  static async requestToken(userId, serviceId) {
    // 1. Duplicate active token check
    const existingActiveToken = store.tokens.find(
      t => t.userId === userId && ['WAITING', 'CHECKED_IN', 'CALLED', 'SERVING'].includes(t.status)
    );

    if (existingActiveToken) {
      const err = new Error('User already has an active token in progress.');
      err.statusCode = 400;
      throw err;
    }

    const service = store.services.find(s => s.serviceId === serviceId);
    if (!service) {
      const err = new Error('Selected service not found.');
      err.statusCode = 404;
      throw err;
    }

    const department = store.departments.find(d => d.departmentId === service.departmentId);
    const organizationId = department ? department.organizationId : 'org-1';

    // 2. Generate unique token number
    const tokenNumber = generateNextTokenNumber(serviceId);
    const tokenId = `tok-${Date.now()}`;

    // 3. Count people ahead
    const currentQueue = store.tokens.filter(
      t => t.serviceId === serviceId && ['WAITING', 'CHECKED_IN'].includes(t.status)
    );
    const peopleAhead = currentQueue.length;

    // 4. Count active counters
    const activeCounters = store.counters.filter(
      c => c.departmentId === service.departmentId && c.status === 'ACTIVE'
    ).length || 1;

    // 5. Predict estimated waiting time
    const mlResult = await MLIntegrationService.predictWaitingTime({
      peopleAhead,
      activeCounters,
      averageServiceTime: service.averageServiceTime,
      queueLength: currentQueue.length + 1,
      serviceType: service.name
    });

    const user = store.users.find(u => u.userId === userId) || { userId, name: 'User' };

    const newToken = {
      tokenId,
      tokenNumber,
      userId,
      organizationId,
      departmentId: service.departmentId,
      serviceId,
      counterId: null,
      status: 'WAITING',
      qrCodeData: `QUELESS:${tokenNumber}:${tokenId}`,
      peopleAhead,
      estimatedWaitMinutes: mlResult.predictedWaitingMinutes,
      confidenceRange: mlResult.confidenceRange,
      createdAt: new Date().toISOString(),
      checkedInAt: null,
      calledAt: null,
      servingStartedAt: null,
      completedAt: null
    };

    store.tokens.push(newToken);

    // Notify user
    await FCMNotificationService.notifyTokenCreated(user, tokenNumber, mlResult.confidenceRange);

    return newToken;
  }

  /**
   * Cancel an active token
   */
  static async cancelToken(tokenId, userId, userRole) {
    const token = store.tokens.find(t => t.tokenId === tokenId);
    if (!token) {
      const err = new Error('Token not found.');
      err.statusCode = 404;
      throw err;
    }

    // Security check: User can only cancel their own token unless ADMIN/STAFF
    if (userRole === 'USER' && token.userId !== userId) {
      const err = new Error('Unauthorized: Cannot modify another user token.');
      err.statusCode = 403;
      throw err;
    }

    if (['COMPLETED', 'CANCELLED'].includes(token.status)) {
      const err = new Error(`Token is already ${token.status.toLowerCase()}.`);
      err.statusCode = 400;
      throw err;
    }

    token.status = 'CANCELLED';
    token.completedAt = new Date().toISOString();

    // Recalculate remaining queue
    await this.updateQueuePositions(token.serviceId);

    return token;
  }

  /**
   * Check in via QR code
   */
  static async checkInToken(tokenId, userId) {
    const token = store.tokens.find(t => t.tokenId === tokenId);
    if (!token) {
      const err = new Error('Token not found.');
      err.statusCode = 404;
      throw err;
    }

    if (token.userId !== userId) {
      const err = new Error('Token does not belong to this user account.');
      err.statusCode = 403;
      throw err;
    }

    if (token.status !== 'WAITING') {
      const err = new Error(`Cannot check in. Current token status is ${token.status}.`);
      err.statusCode = 400;
      throw err;
    }

    token.status = 'CHECKED_IN';
    token.checkedInAt = new Date().toISOString();

    return token;
  }

  /**
   * Call Next Token for a staff counter
   */
  static async callNextToken(counterId, staffUserId) {
    const counter = store.counters.find(c => c.counterId === counterId);
    if (!counter) {
      const err = new Error('Counter not found.');
      err.statusCode = 404;
      throw err;
    }

    // If currently serving a token, raise warning or wrap up
    const deptServices = store.services.filter(s => s.departmentId === counter.departmentId);
    const serviceIds = deptServices.map(s => s.serviceId);

    // Prioritize CHECKED_IN tokens first, then WAITING tokens (FIFO)
    let candidateToken = store.tokens
      .filter(t => serviceIds.includes(t.serviceId) && t.status === 'CHECKED_IN')
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];

    if (!candidateToken) {
      candidateToken = store.tokens
        .filter(t => serviceIds.includes(t.serviceId) && t.status === 'WAITING')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0];
    }

    if (!candidateToken) {
      const err = new Error('No waiting tokens available in queue.');
      err.statusCode = 404;
      throw err;
    }

    candidateToken.status = 'CALLED';
    candidateToken.counterId = counterId;
    candidateToken.calledAt = new Date().toISOString();
    candidateToken.peopleAhead = 0;
    candidateToken.estimatedWaitMinutes = 0;
    candidateToken.confidenceRange = 'Now Serving';

    counter.currentServingTokenId = candidateToken.tokenId;

    // Send notification
    await FCMNotificationService.notifyNowServing(candidateToken.userId, candidateToken.tokenNumber, counter.counterNumber);

    // Update queue for remaining users
    await this.updateQueuePositions(candidateToken.serviceId);

    return candidateToken;
  }

  /**
   * Mark token serving / completed by staff
   */
  static async completeToken(tokenId, staffUserId) {
    const token = store.tokens.find(t => t.tokenId === tokenId);
    if (!token) {
      const err = new Error('Token not found.');
      err.statusCode = 404;
      throw err;
    }

    token.status = 'COMPLETED';
    token.completedAt = new Date().toISOString();

    // Reset current token on counter
    if (token.counterId) {
      const counter = store.counters.find(c => c.counterId === token.counterId);
      if (counter && counter.currentServingTokenId === tokenId) {
        counter.currentServingTokenId = null;
      }
    }

    // Record historical data for ML training
    const service = store.services.find(s => s.serviceId === token.serviceId);
    const createdAtTime = new Date(token.createdAt).getTime();
    const completedAtTime = new Date(token.completedAt).getTime();
    const actualWaitMinutes = Math.max(1, Math.round((completedAtTime - createdAtTime) / 60000));

    store.queueHistory.push({
      historyId: `hist-${Date.now()}`,
      tokenId: token.tokenId,
      serviceId: token.serviceId,
      serviceType: service ? service.name : 'General',
      peopleAhead: token.peopleAhead || 0,
      activeCounters: store.counters.filter(c => c.status === 'ACTIVE').length,
      averageServiceTime: service ? service.averageServiceTime : 5,
      queueLength: store.tokens.filter(t => t.serviceId === token.serviceId && t.status === 'WAITING').length,
      hour: new Date(token.createdAt).getHours(),
      dayOfWeek: new Date(token.createdAt).getDay(),
      recentSkippedCount: store.tokens.filter(t => t.status === 'SKIPPED').length,
      actualWaitMinutes,
      createdAt: new Date().toISOString()
    });

    await this.updateQueuePositions(token.serviceId);

    return token;
  }

  /**
   * Skip token (No-show handling)
   */
  static async skipToken(tokenId, staffUserId) {
    const token = store.tokens.find(t => t.tokenId === tokenId);
    if (!token) {
      const err = new Error('Token not found.');
      err.statusCode = 404;
      throw err;
    }

    token.status = 'SKIPPED';
    token.completedAt = new Date().toISOString();

    if (token.counterId) {
      const counter = store.counters.find(c => c.counterId === token.counterId);
      if (counter && counter.currentServingTokenId === tokenId) {
        counter.currentServingTokenId = null;
      }
    }

    await this.updateQueuePositions(token.serviceId);
    return token;
  }

  /**
   * Recall token
   */
  static async recallToken(tokenId, staffUserId) {
    const token = store.tokens.find(t => t.tokenId === tokenId);
    if (!token) {
      const err = new Error('Token not found.');
      err.statusCode = 404;
      throw err;
    }

    token.status = 'CALLED';
    token.calledAt = new Date().toISOString();

    if (token.counterId) {
      const counter = store.counters.find(c => c.counterId === token.counterId);
      if (counter) {
        await FCMNotificationService.notifyNowServing(token.userId, token.tokenNumber, counter.counterNumber);
      }
    }

    return token;
  }
}
