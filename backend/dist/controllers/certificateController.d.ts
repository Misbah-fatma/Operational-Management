import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getCertificates: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getCertificate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createCertificate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateCertificate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteCertificate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const downloadCertificate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getCertificateDashboard: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const exportCertificatesExcel: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const exportCertificatesPdf: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=certificateController.d.ts.map