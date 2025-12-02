module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  API_GATEWAY_NAME: process.env.API_GATEWAY_NAME || 'api-gateway',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  CORS_ORIGIN: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'],
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  USERS_SERVICE_URL: process.env.USERS_SERVICE_URL || 'http://localhost:3002',
  IA_SERVICE_URL: process.env.IA_SERVICE_URL || 'http://localhost:3003',
  PUBLIC_ROUTES: process.env.PUBLIC_ROUTES 
    ? process.env.PUBLIC_ROUTES.split(',').map(route => route.trim())
    : ['/auth/login', '/auth/register', '/health', '/api-docs'],
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
