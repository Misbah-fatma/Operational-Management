import cron from 'node-cron';
import { env } from '../config/env';
import logger from '../config/logger';
import { certificateService } from '../services/certificateService';
import { vehicleService } from '../services/vehicleService';

export const startCronJobs = (): void => {
  // Update certificate expiry statuses daily at midnight
  cron.schedule(env.certStatusCron, async () => {
    try {
      const updated = await certificateService.updateExpiryStatuses();
      logger.info(`Certificate status cron: updated ${updated} certificates`);
    } catch (error) {
      logger.error('Certificate status cron error:', error);
    }
  });

  // Send certificate expiry reminders daily at 8 AM
  cron.schedule(env.certReminderCron, async () => {
    try {
      const sent = await certificateService.sendExpiryReminders(env.certExpiryReminderDays);
      logger.info(`Certificate reminder cron: sent ${sent} reminders`);
    } catch (error) {
      logger.error('Certificate reminder cron error:', error);
    }
  });

  // Process vehicle alerts daily at 9 AM
  cron.schedule(env.vehicleAlertCron, async () => {
    try {
      const alerts = await vehicleService.processVehicleAlerts();
      logger.info(`Vehicle alert cron: processed ${alerts} alerts`);
    } catch (error) {
      logger.error('Vehicle alert cron error:', error);
    }
  });

  logger.info('Cron jobs scheduled');
};
