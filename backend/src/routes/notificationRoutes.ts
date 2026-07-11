import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { idParamValidation, paginationValidation } from '../validators';
import { PERMISSIONS } from '../constants';

const router = Router();

router.use(authenticate);
router.use(authorize(PERMISSIONS.NOTIFICATIONS_READ));

router.get('/', validate(paginationValidation), notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', validate(idParamValidation), notificationController.markAsRead);
router.delete('/:id', validate(idParamValidation), notificationController.deleteNotification);

export default router;
