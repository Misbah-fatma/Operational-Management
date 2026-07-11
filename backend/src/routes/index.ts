import { Router } from 'express';
import authRoutes from './authRoutes';
import certificateRoutes from './certificateRoutes';
import vehicleRoutes from './vehicleRoutes';
import notificationRoutes from './notificationRoutes';
import projectRoutes from './projectRoutes';
import executiveDashboardRoutes from './executiveDashboardRoutes';
import reportRoutes from './reportRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/certificates', certificateRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/notifications', notificationRoutes);
router.use('/projects', projectRoutes);
router.use('/executive', executiveDashboardRoutes);
router.use('/reports', reportRoutes);

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

export default router;
