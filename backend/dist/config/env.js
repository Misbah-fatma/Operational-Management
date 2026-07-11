"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const getEnv = (key, defaultValue) => {
    const value = process.env[key] ?? defaultValue;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};
exports.env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5001', 10),
    mongodbUri: getEnv('MONGODB_URI', 'mongodb://localhost:27017/operational_management'),
    jwtSecret: getEnv('JWT_SECRET', 'dev-secret-change-me'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    smtp: {
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || 'Operational Platform <noreply@company.com>',
    },
    certExpiryReminderDays: (process.env.CERT_EXPIRY_REMINDER_DAYS || '30,14,7,1')
        .split(',')
        .map((d) => parseInt(d.trim(), 10)),
    certStatusCron: process.env.CERT_STATUS_CRON || '0 0 * * *',
    certReminderCron: process.env.CERT_REMINDER_CRON || '0 8 * * *',
    vehicleAlertCron: process.env.VEHICLE_ALERT_CRON || '0 9 * * *',
};
//# sourceMappingURL=env.js.map