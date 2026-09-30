import http from 'http';
import app from './src/app.js';
import { logger } from './src/utils/logger.js';

let PORT = parseInt(process.env.PORT, 10) || 5000;
const server = http.createServer(app);

function startServer(portToUse) {
  server.listen(portToUse, () => {
    logger.info(`==================================================`);
    logger.info(` QueueLess Express Backend Running on Port ${portToUse}`);
    logger.info(` Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(` Health Check: http://localhost:${portToUse}/health`);
    logger.info(`==================================================`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    logger.warn(`Port ${PORT} is currently in use. Retrying on fallback port ${PORT + 1}...`);
    PORT += 1;
    setTimeout(() => {
      server.close();
      startServer(PORT);
    }, 500);
  } else {
    logger.error('Server error:', err);
  }
});

startServer(PORT);

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
});
