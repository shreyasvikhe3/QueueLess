import { MLIntegrationService } from '../services/mlIntegrationService.js';
import { store } from '../models/store.js';

export class MLController {
  static async predict(req, res, next) {
    try {
      const { people_ahead, active_counters, average_service_time, queue_length, hour, day_of_week, service_type } = req.body;

      const prediction = await MLIntegrationService.predictWaitingTime({
        peopleAhead: people_ahead || 0,
        activeCounters: active_counters || 1,
        averageServiceTime: average_service_time || 5,
        queueLength: queue_length || 1,
        hour: hour || new Date().getHours(),
        dayOfWeek: day_of_week ?? new Date().getDay(),
        serviceType: service_type || 'General'
      });

      res.json({
        success: true,
        data: {
          predicted_waiting_time: prediction.predictedWaitingMinutes,
          confidence_range: prediction.confidenceRange,
          source: prediction.source
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getHistoryDataset(req, res, next) {
    try {
      res.json({
        success: true,
        count: store.queueHistory.length,
        data: store.queueHistory
      });
    } catch (err) {
      next(err);
    }
  }
}
