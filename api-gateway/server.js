require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');
const { PORT, NODE_ENV, API_GATEWAY_NAME } = require('./src/config/env');

const server = app.listen(PORT, () => {
  logger.info(`🚀 ${API_GATEWAY_NAME} running on port ${PORT}`);
  logger.info(`📝 Environment: ${NODE_ENV}`);
  logger.info(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});

module.exports = server;