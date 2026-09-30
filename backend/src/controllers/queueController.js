import { TokenQueueService } from '../services/tokenQueueService.js';
import { calculateCrowdDensity } from '../utils/crowdDensityCalc.js';
import { store } from '../models/store.js';

export class QueueController {
  static async getQueueByService(req, res, next) {
    try {
      const { serviceId } = req.params;

      const service = store.services.find(s => s.serviceId === serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          error: { message: 'Service not found.' }
        });
      }

      const activeTokens = store.tokens.filter(
        t => t.serviceId === serviceId && ['WAITING', 'CHECKED_IN', 'CALLED', 'SERVING'].includes(t.status)
      );

      const currentlyServing = activeTokens.filter(t => ['CALLED', 'SERVING'].includes(t.status));
      const waitingList = activeTokens
        .filter(t => ['WAITING', 'CHECKED_IN'].includes(t.status))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const crowdDensity = calculateCrowdDensity(serviceId);

      const activeCounters = store.counters.filter(
        c => c.departmentId === service.departmentId && c.status === 'ACTIVE'
      );

      res.json({
        success: true,
        data: {
          serviceId: service.serviceId,
          serviceName: service.name,
          averageServiceTime: service.averageServiceTime,
          crowdDensity,
          activeCountersCount: activeCounters.length,
          currentlyServing,
          waitingCount: waitingList.length,
          waitingTokens: waitingList.map(t => ({
            tokenId: t.tokenId,
            tokenNumber: t.tokenNumber,
            status: t.status,
            peopleAhead: t.peopleAhead,
            estimatedWaitMinutes: t.estimatedWaitMinutes,
            confidenceRange: t.confidenceRange,
            createdAt: t.createdAt
          }))
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async callNext(req, res, next) {
    try {
      const { counterId } = req.body;
      if (!counterId) {
        return res.status(400).json({
          success: false,
          error: { message: 'counterId is required to call next token.' }
        });
      }

      const calledToken = await TokenQueueService.callNextToken(counterId, req.user.userId);
      res.json({
        success: true,
        data: calledToken,
        message: `Token ${calledToken.tokenNumber} called to counter.`
      });
    } catch (err) {
      next(err);
    }
  }

  static async completeToken(req, res, next) {
    try {
      const { tokenId } = req.params;
      const completedToken = await TokenQueueService.completeToken(tokenId, req.user.userId);
      res.json({
        success: true,
        data: completedToken,
        message: `Token ${completedToken.tokenNumber} completed.`
      });
    } catch (err) {
      next(err);
    }
  }

  static async skipToken(req, res, next) {
    try {
      const { tokenId } = req.params;
      const skippedToken = await TokenQueueService.skipToken(tokenId, req.user.userId);
      res.json({
        success: true,
        data: skippedToken,
        message: `Token ${skippedToken.tokenNumber} marked as SKIPPED (no-show).`
      });
    } catch (err) {
      next(err);
    }
  }

  static async recallToken(req, res, next) {
    try {
      const { tokenId } = req.params;
      const recalledToken = await TokenQueueService.recallToken(tokenId, req.user.userId);
      res.json({
        success: true,
        data: recalledToken,
        message: `Token ${recalledToken.tokenNumber} recalled.`
      });
    } catch (err) {
      next(err);
    }
  }
}
