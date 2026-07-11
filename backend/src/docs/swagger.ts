import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Operational Management Platform API',
      version: '1.0.0',
      description: 'REST API for Certificate Management and Fleet Management',
    },
    servers: [
      { url: `http://localhost:${env.port}`, description: 'Development server' },
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
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Certificates', description: 'Certificate management' },
      { name: 'Vehicles', description: 'Fleet management' },
      { name: 'Notifications', description: 'Notification system' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/docs/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);
