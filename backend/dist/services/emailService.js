"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVehicleAlertEmail = exports.sendCertificateExpiryEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../config/logger"));
const transporter = env_1.env.smtp.host && env_1.env.smtp.user
    ? nodemailer_1.default.createTransport({
        host: env_1.env.smtp.host,
        port: env_1.env.smtp.port,
        secure: env_1.env.smtp.secure,
        auth: { user: env_1.env.smtp.user, pass: env_1.env.smtp.pass },
    })
    : null;
const sendEmail = async (options) => {
    if (!transporter) {
        logger_1.default.warn(`Email not configured. Would send to ${options.to}: ${options.subject}`);
        return false;
    }
    try {
        await transporter.sendMail({
            from: env_1.env.smtp.from,
            to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });
        logger_1.default.info(`Email sent to ${options.to}`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Email send error:', error);
        return false;
    }
};
exports.sendEmail = sendEmail;
const sendCertificateExpiryEmail = async (to, certificateName, expiryDate, daysRemaining) => {
    const html = `
    <h2>Certificate Expiry Reminder</h2>
    <p>The following certificate is expiring in <strong>${daysRemaining} day(s)</strong>:</p>
    <ul>
      <li><strong>Certificate:</strong> ${certificateName}</li>
      <li><strong>Expiry Date:</strong> ${expiryDate.toLocaleDateString()}</li>
    </ul>
    <p>Please take necessary action to renew this certificate.</p>
  `;
    return (0, exports.sendEmail)({
        to,
        subject: `Certificate Expiry Alert: ${certificateName}`,
        html,
    });
};
exports.sendCertificateExpiryEmail = sendCertificateExpiryEmail;
const sendVehicleAlertEmail = async (to, vehicleName, alertType, dueDate) => {
    const html = `
    <h2>Vehicle Alert: ${alertType}</h2>
    <p>Attention required for vehicle <strong>${vehicleName}</strong>.</p>
    ${dueDate ? `<p><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>` : ''}
    <p>Please review and take appropriate action.</p>
  `;
    return (0, exports.sendEmail)({
        to,
        subject: `Vehicle Alert: ${vehicleName} - ${alertType}`,
        html,
    });
};
exports.sendVehicleAlertEmail = sendVehicleAlertEmail;
//# sourceMappingURL=emailService.js.map