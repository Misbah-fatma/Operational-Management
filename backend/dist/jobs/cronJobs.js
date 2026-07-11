"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../config/logger"));
const certificateService_1 = require("../services/certificateService");
const vehicleService_1 = require("../services/vehicleService");
const startCronJobs = () => {
    // Update certificate expiry statuses daily at midnight
    node_cron_1.default.schedule(env_1.env.certStatusCron, async () => {
        try {
            const updated = await certificateService_1.certificateService.updateExpiryStatuses();
            logger_1.default.info(`Certificate status cron: updated ${updated} certificates`);
        }
        catch (error) {
            logger_1.default.error('Certificate status cron error:', error);
        }
    });
    // Send certificate expiry reminders daily at 8 AM
    node_cron_1.default.schedule(env_1.env.certReminderCron, async () => {
        try {
            const sent = await certificateService_1.certificateService.sendExpiryReminders(env_1.env.certExpiryReminderDays);
            logger_1.default.info(`Certificate reminder cron: sent ${sent} reminders`);
        }
        catch (error) {
            logger_1.default.error('Certificate reminder cron error:', error);
        }
    });
    // Process vehicle alerts daily at 9 AM
    node_cron_1.default.schedule(env_1.env.vehicleAlertCron, async () => {
        try {
            const alerts = await vehicleService_1.vehicleService.processVehicleAlerts();
            logger_1.default.info(`Vehicle alert cron: processed ${alerts} alerts`);
        }
        catch (error) {
            logger_1.default.error('Vehicle alert cron error:', error);
        }
    });
    logger_1.default.info('Cron jobs scheduled');
};
exports.startCronJobs = startCronJobs;
//# sourceMappingURL=cronJobs.js.map