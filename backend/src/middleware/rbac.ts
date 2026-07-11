import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { ApiError } from '../utils/ApiResponse';
import { Permission, ROLE_PERMISSIONS, Role } from '../constants';

export const authorize = (...permissions: Permission[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }

    const userRole = req.user.role as Role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasPermission = permissions.some((p) => userPermissions.includes(p));
    if (!hasPermission) {
      next(new ApiError(403, 'Insufficient permissions'));
      return;
    }

    next();
  };
};

export const authorizeRoles = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ApiError(401, 'Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role as Role)) {
      next(new ApiError(403, 'Insufficient role permissions'));
      return;
    }

    next();
  };
};

export const hasPermission = (role: Role, permission: Permission): boolean => {
  return (ROLE_PERMISSIONS[role] || []).includes(permission);
};
