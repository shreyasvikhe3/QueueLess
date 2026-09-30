import axios from 'axios';
import { logger } from '../utils/logger.js';
import { FallbackWaitService } from './fallbackWaitService.js';

export class MLIntegrationService {
  static async predictWaitingTime(queueContext) {
    const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    try {
      logger.info('Requesting ML waiting time prediction from FastAPI service...', queueContext);

      const response = await axios.post(`${mlUrl}/predict-waiting-time`, {
        people_ahead: queueContext.peopleAhead,
        active_counters: queueContext.activeCounters,
        average_service_time: queueContext.averageServiceTime,
        queue_length: queueContext.queueLength,
        hour: queueContext.hour || new Date().getHours(),
        day_of_week: queueContext.dayOfWeek ?? new Date().getDay(),
        service_type: queueContext.serviceType || 'general'
      }, { timeout: 2500 });

      if (response.data && response.data.predicted_waiting_time !== undefined) {
        return {
          predictedWaitingMinutes: response.data.predicted_waiting_time,
          confidenceRange: response.data.confidence_range || `${Math.max(0, response.data.predicted_waiting_time - 3)}-${response.data.predicted_waiting_time + 4} minutes`,
          source: 'PYTHON_FASTAPI_ML_MODEL',
          modelUsed: response.data.model_used || 'RandomForest'
        };
      }
    } catch (err) {
      logger.warn('ML FastAPI service call failed or timed out. Switching to statistical fallback estimator.', err.message);
    }

    // Dynamic statistical fallback
    return FallbackWaitService.estimateWaitTime({
      peopleAhead: queueContext.peopleAhead,
      activeCounters: queueContext.activeCounters,
      averageServiceTime: queueContext.averageServiceTime
    });
  }
}
