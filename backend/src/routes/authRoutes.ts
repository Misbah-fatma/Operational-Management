import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import {
  loginValidation,
  registerValidation,
  changePasswordValidation,
} from '../validators';
import { PERMISSIONS } from '../constants';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 */
router.post('/login', validate(loginValidation), authController.login);

router.post('/register', authenticate, authorize(PERMISSIONS.USERS_CREATE), validate(registerValidation), authController.register);

router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, validate(changePasswordValidation), authController.changePassword);

router.get('/users', authenticate, authorize(PERMISSIONS.USERS_READ), authController.getUsers);

export default router;
