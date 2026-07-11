import { Response } from 'express';
export declare const exportToExcel: (res: Response, filename: string, columns: {
    header: string;
    key: string;
    width?: number;
}[], rows: Record<string, unknown>[]) => Promise<void>;
export declare const exportToPdf: (res: Response, filename: string, title: string, columns: string[], rows: string[][]) => void;
export declare const generateCertificateId: () => string;
export declare const generateVehicleId: () => string;
export declare const generateAssignmentId: () => string;
export declare const generateProjectAssignmentId: () => string;
export declare const calculateProjectProgress: (milestones: {
    progressPercent: number;
}[], progressUpdates: {
    progressPercent: number;
    date?: Date;
}[]) => number;
export declare const calculateDelayStatus: (plannedProgress: number, actualProgress: number) => string;
export declare const calculateCertificateStatus: (expiryDate: Date, currentStatus?: string) => string;
export declare const calculateVehicleStatus: (vehicle: {
    currentStatus: string;
    insuranceExpiryDate?: Date;
    mvpiExpiryDate?: Date;
    isAssigned?: boolean;
}) => string;
//# sourceMappingURL=helpers.d.ts.map