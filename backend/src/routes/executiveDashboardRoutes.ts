import { Router } from 'express';
import * as executiveDashboardController from '../controllers/executiveDashboardController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { PERMISSIONS } from '../constants';

const router = Router();

router.use(authenticate);
router.get('/dashboard', authorize(PERMISSIONS.DASHBOARD_READ), executiveDashboardController.getExecutiveDashboard);

export default router;
