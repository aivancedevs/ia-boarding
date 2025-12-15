const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('../../../config/env');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Users Service API',
      version: '1.0.0',
      description: 'API documentation for Users, Clients, and Projects microservice',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.app.port}/api`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        ApiGatewayAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-User-Id',
          description: 'User ID from API Gateway',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            fullName: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'CLIENT_ADMIN', 'USER'] },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
            clientId: { type: 'string', format: 'uuid', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['ACTIVE', 'ARCHIVED'] },
            clientId: { type: 'string', format: 'uuid' },
            startDate: { type: 'string', format: 'date', nullable: true },
            endDate: { type: 'string', format: 'date', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            details: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    security: [
      {
        ApiGatewayAuth: [],
      },
    ],
  },
  apis: ['./src/infrastructure/http/routes/*.js'],
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: 'Users Service API',
  }));
}

module.exports = { setupSwagger, specs };