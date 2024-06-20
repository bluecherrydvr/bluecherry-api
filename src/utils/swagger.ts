const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bluecherry API',
      version: '1.0.0',
      description: 'API documentation for your Node.js application',
    },
  },
  apis: ['src/routes/controllers/*/*.ts'], // Path to the API routes
};

module.exports = swaggerJSDoc(options);
