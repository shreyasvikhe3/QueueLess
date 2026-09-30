import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[API ERROR ${statusCode}] ${req.method} ${req.originalUrl}: ${message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString()
    }
  });
}
