require('dotenv').config();

module.exports = {
  app: {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3002,
    serviceName: process.env.SERVICE_NAME || 'users-service',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE, 10) || 10,
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE, 10) || 100,
  },
  apiGateway: {
    url: process.env.API_GATEWAY_URL || 'http://localhost:3000',
  },
};