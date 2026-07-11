import nodemailer from 'nodemailer';
import { env } from '../config/env';
import logger from '../config/logger';

const transporter =
  env.smtp.host && env.smtp.user
    ? nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: env.smtp.secure,
        auth: { user: env.smtp.user, pass: env.smtp.pass },
      })
    : null;

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  if (!transporter) {
    logger.warn(`Email not configured. Would send to ${options.to}: ${options.subject}`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: env.smtp.from,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    logger.info(`Email sent to ${options.to}`);
    return true;
  } catch (error) {
    logger.error('Email send error:', error);
    return false;
  }
};

export const sendCertificateExpiryEmail = async (
  to: string,
  certificateName: string,
  expiryDate: Date,
  daysRemaining: number,
): Promise<boolean> => {
  const html = `
    <h2>Certificate Expiry Reminder</h2>
    <p>The following certificate is expiring in <strong>${daysRemaining} day(s)</strong>:</p>
    <ul>
      <li><strong>Certificate:</strong> ${certificateName}</li>
      <li><strong>Expiry Date:</strong> ${expiryDate.toLocaleDateString()}</li>
    </ul>
    <p>Please take necessary action to renew this certificate.</p>
  `;

  return sendEmail({
    to,
    subject: `Certificate Expiry Alert: ${certificateName}`,
    html,
  });
};

export const sendVehicleAlertEmail = async (
  to: string,
  vehicleName: string,
  alertType: string,
  dueDate?: Date,
): Promise<boolean> => {
  const html = `
    <h2>Vehicle Alert: ${alertType}</h2>
    <p>Attention required for vehicle <strong>${vehicleName}</strong>.</p>
    ${dueDate ? `<p><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>` : ''}
    <p>Please review and take appropriate action.</p>
  `;

  return sendEmail({
    to,
    subject: `Vehicle Alert: ${vehicleName} - ${alertType}`,
    html,
  });
};
