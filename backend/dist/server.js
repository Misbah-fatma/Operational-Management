"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./models");
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const logger_1 = __importDefault(require("./config/logger"));
const cronJobs_1 = require("./jobs/cronJobs");
const startServer = async () => {
    await (0, database_1.connectDatabase)();
    (0, cronJobs_1.startCronJobs)();
    app_1.default.listen(env_1.env.port, () => {
        logger_1.default.info(`Server running on port ${env_1.env.port} in ${env_1.env.nodeEnv} mode`);
        logger_1.default.info(`API docs: http://localhost:${env_1.env.port}/api/docs`);
    });
};
startServer().catch((error) => {
    logger_1.default.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map