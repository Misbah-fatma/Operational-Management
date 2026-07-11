"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const env_1 = require("../config/env");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Operational Management Platform API',
            version: '1.0.0',
            description: 'REST API for Certificate Management and Fleet Management',
        },
        servers: [
            { url: `http://localhost:${env_1.env.port}`, description: 'Development server' },
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
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
//# sourceMappingURL=swagger.js.map