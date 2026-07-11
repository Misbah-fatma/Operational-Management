import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getReportTypes: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const generateReport: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const exportReportExcel: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const exportReportPdf: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=reportController.d.ts.map