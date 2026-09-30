import { TokenQueueService } from '../services/tokenQueueService.js';
import { store } from '../models/store.js';

export class TokenController {
  static async createToken(req, res, next) {
    try {
      const { serviceId } = req.body;
      if (!serviceId) {
        return res.status(400).json({
          success: false,
          error: { message: 'serviceId is required to request a token.' }
        });
      }

      const token = await TokenQueueService.requestToken(req.user.userId, serviceId);
      res.status(201).json({
        success: true,
        data: token
      });
    } catch (err) {
      next(err);
    }
  }

  static async getActiveToken(req, res, next) {
    try {
      const activeToken = store.tokens.find(
        t => t.userId === req.user.userId && ['WAITING', 'CHECKED_IN', 'CALLED', 'SERVING'].includes(t.status)
      );

      if (!activeToken) {
        return res.json({
          success: true,
          data: null,
          message: 'No active token found.'
        });
      }

      // Populate service and department details
      const service = store.services.find(s => s.serviceId === activeToken.serviceId);
      const department = store.departments.find(d => d.departmentId === activeToken.departmentId);
      const counter = activeToken.counterId ? store.counters.find(c => c.counterId === activeToken.counterId) : null;

      res.json({
        success: true,
        data: {
          ...activeToken,
          serviceName: service ? service.name : 'Unknown Service',
          departmentName: department ? department.name : 'Unknown Department',
          counterNumber: counter ? counter.counterNumber : null
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getTokenById(req, res, next) {
    try {
      const { id } = req.params;
      const token = store.tokens.find(t => t.tokenId === id);
      if (!token) {
        return res.status(404).json({
          success: false,
          error: { message: 'Token not found.' }
        });
      }

      const service = store.services.find(s => s.serviceId === token.serviceId);
      const department = store.departments.find(d => d.departmentId === token.departmentId);
      const counter = token.counterId ? store.counters.find(c => c.counterId === token.counterId) : null;

      res.json({
        success: true,
        data: {
          ...token,
          serviceName: service ? service.name : 'Unknown Service',
          departmentName: department ? department.name : 'Unknown Department',
          counterNumber: counter ? counter.counterNumber : null
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async cancelToken(req, res, next) {
    try {
      const { id } = req.params;
      const cancelledToken = await TokenQueueService.cancelToken(id, req.user.userId, req.user.role);
      res.json({
        success: true,
        data: cancelledToken,
        message: 'Token cancelled successfully.'
      });
    } catch (err) {
      next(err);
    }
  }

  static async checkInToken(req, res, next) {
    try {
      const { id } = req.params;
      const checkedInToken = await TokenQueueService.checkInToken(id, req.user.userId);
      res.json({
        success: true,
        data: checkedInToken,
        message: 'QR Code verified! You are now checked in at the location.'
      });
    } catch (err) {
      next(err);
    }
  }

  static async getTokenHistory(req, res, next) {
    try {
      const userTokens = store.tokens
        .filter(t => t.userId === req.user.userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const enrichedTokens = userTokens.map(t => {
        const service = store.services.find(s => s.serviceId === t.serviceId);
        return {
          ...t,
          serviceName: service ? service.name : 'Unknown Service'
        };
      });

      res.json({
        success: true,
        data: enrichedTokens
      });
    } catch (err) {
      next(err);
    }
  }
}
