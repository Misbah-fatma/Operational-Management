import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { Permission, Role } from '../constants';
export declare const authorize: (...permissions: Permission[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const authorizeRoles: (...roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const hasPermission: (role: Role, permission: Permission) => boolean;
//# sourceMappingURL=rbac.d.ts.map