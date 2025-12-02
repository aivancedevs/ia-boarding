const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth Service API',
      version: '1.0.0',
      description: 'Microservicio de autenticación con JWT y OAuth Google',
      contact: {
        name: 'API Support',
        email: 'support@authservice.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación'
      }
    ]
  },
  apis: ['./src/infrastructure/http/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };