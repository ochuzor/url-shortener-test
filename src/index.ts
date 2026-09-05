import { config } from './config/env.config.js';
import { logger } from './infrastructure/logging/logger.js';
import { createApp } from './transport/http/app.js';

const app = createApp({ baseUrl: config.BASE_URL });

const server = app.listen(config.PORT, () => {
  logger.info(`URL Shortener Microservice listening on port ${config.PORT}`);
  logger.info(`Base URL configured as: ${config.BASE_URL}`);
});

const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
