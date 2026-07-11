import './models';
import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import logger from './config/logger';
import { startCronJobs } from './jobs/cronJobs';

const startServer = async () => {
  await connectDatabase();
  startCronJobs();

  app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
    logger.info(`API docs: http://localhost:${env.port}/api/docs`);
  });
};

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
