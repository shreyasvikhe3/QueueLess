import { logger } from '../utils/logger.js';

export class FCMNotificationService {
  static async sendNotification(userId, title, body, data = {}) {
    logger.info(`[NOTIFICATION SENT] To User: ${userId} | Title: "${title}" | Body: "${body}"`, data);

    // Simulated FCM Web Push dispatch for dev & real web notification integration
    return {
      success: true,
      timestamp: new Date().toISOString(),
      recipientUserId: userId,
      title,
      body,
      data
    };
  }

  static async notifyTokenCreated(user, tokenNumber, estimatedWait) {
    return this.sendNotification(
      user.userId,
      'Token Generated Successfully',
      `Your token ${tokenNumber} is ready. Estimated wait: ${estimatedWait}.`,
      { tokenNumber, type: 'TOKEN_CREATED' }
    );
  }

  static async notifyTurnApproaching(userId, tokenNumber, peopleAhead) {
    return this.sendNotification(
      userId,
      'Your Turn is Approaching!',
      `Token ${tokenNumber}: Only ${peopleAhead} ${peopleAhead === 1 ? 'person' : 'people'} ahead of you. Please head to the counter area.`,
      { tokenNumber, peopleAhead, type: 'TURN_APPROACHING' }
    );
  }

  static async notifyNowServing(userId, tokenNumber, counterNumber) {
    return this.sendNotification(
      userId,
      'Now Serving Your Token!',
      `Your token ${tokenNumber} is being served at Counter ${counterNumber}. Please present your QR code within 2 minutes.`,
      { tokenNumber, counterNumber, type: 'NOW_SERVING' }
    );
  }
}
