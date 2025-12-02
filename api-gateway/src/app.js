const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const { corsOptions } = require('./config/cors');
const { rateLimiter } = require('./middlewares/rateLimiter.middleware');
const { loggerMiddleware } = require('./middlewares/logger.middleware');
const { errorHandler } = require('./middlewares/errorHandler.middleware');
const routes = require('./routes');
const logger = require('./utils/logger');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(corsOptions);

app.use(rateLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(loggerMiddleware);

try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Gateway Documentation'
  }));
  logger.info('✅ Swagger documentation loaded successfully');
} catch (error) {
  logger.error('❌ Error loading Swagger documentation:', error.message);
}

app.use('/', routes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

module.exports = app;