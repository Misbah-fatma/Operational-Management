import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AuditLog } from '../models/AuditLog';

export const auditLog = (action: string, entity: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const originalJson = res.json.bind(res);

    res.json = function (body: unknown) {
      if (req.user && res.statusCode < 400) {
        const entityId =
          (req.params.id as string) ||
          (body as { data?: { _id?: string } })?.data?._id;

        AuditLog.create({
          user: req.user._id,
          action,
          entity,
          entityId,
          changes: req.method !== 'GET' ? req.body : undefined,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        }).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  };
};
