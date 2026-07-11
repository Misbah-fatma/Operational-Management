import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const login: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const register: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const changePassword: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getUsers: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map