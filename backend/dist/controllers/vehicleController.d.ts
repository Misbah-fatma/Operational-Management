import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getVehicles: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getVehicle: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createVehicle: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateVehicle: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteVehicle: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAssignments: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAssignment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createAssignment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const returnVehicle: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createMaintenance: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMaintenanceHistory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getFleetDashboard: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const exportVehiclesExcel: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const exportVehiclesPdf: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=vehicleController.d.ts.map