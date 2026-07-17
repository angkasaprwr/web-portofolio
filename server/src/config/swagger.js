const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sukma Portfolio API',
      version: '1.0.0',
      description: 'REST API for Sukma personal portfolio website with admin CMS',
      contact: { name: 'Sukma Ayu', email: 'admin@sukma.dev' },
    },
    servers: [
      { url: 'http://localhost:5000/api/v1', description: 'Development' },
      { url: '/api/v1', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth' },
      { name: 'About' },
      { name: 'Skills' },
      { name: 'Projects' },
      { name: 'Experiences' },
      { name: 'Certificates' },
      { name: 'Social Links' },
      { name: 'CV' },
      { name: 'Settings' },
      { name: 'Dashboard' },
    ],
  },
  apis: ['./src/routes/*.js', './src/docs/*.js'],
};

module.exports = swaggerJsdoc(options);
