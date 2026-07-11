import { ICertificate } from '../models/Certificate';
import { PaginationOptions, PaginatedResult } from '../utils/pagination';
export interface CertificateFilters {
    search?: string;
    category?: string;
    status?: string;
    relatedEmployee?: string;
    relatedEquipment?: string;
    relatedVehicle?: string;
    relatedProject?: string;
    expiryFrom?: string;
    expiryTo?: string;
}
export interface CreateCertificateInput {
    certificateNumber: string;
    certificateName: string;
    category: ICertificate['category'];
    relatedEmployee?: string;
    relatedEquipment?: string;
    relatedVehicle?: string;
    relatedProject?: string;
    issueDate: Date;
    expiryDate: Date;
    renewalDate?: Date;
    issuingAuthority: string;
    remarks?: string;
    createdBy: string;
}
export declare class CertificateService {
    private buildFilter;
    private populateFields;
    getAll(filters: CertificateFilters, pagination: PaginationOptions): Promise<PaginatedResult<ICertificate>>;
    getById(id: string): Promise<ICertificate>;
    create(input: CreateCertificateInput, file?: Express.Multer.File): Promise<ICertificate>;
    update(id: string, input: Partial<CreateCertificateInput>, updatedBy: string, file?: Express.Multer.File): Promise<ICertificate>;
    softDelete(id: string, deletedBy: string): Promise<void>;
    getDashboardStats(): Promise<{
        total: number;
        active: number;
        expired: number;
        expiringWithin7Days: number;
        expiringWithin30Days: number;
        byCategory: {
            category: any;
            count: any;
        }[];
        byStatus: {
            status: any;
            count: any;
        }[];
        upcomingRenewals: (import("mongoose").Document<unknown, {}, ICertificate, {}, import("mongoose").DefaultSchemaOptions> & ICertificate & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        recentlyAdded: (import("mongoose").Document<unknown, {}, ICertificate, {}, import("mongoose").DefaultSchemaOptions> & ICertificate & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    updateExpiryStatuses(): Promise<number>;
    sendExpiryReminders(reminderDays: number[]): Promise<number>;
    getExportData(filters: CertificateFilters): Promise<(import("mongoose").Document<unknown, {}, ICertificate, {}, import("mongoose").DefaultSchemaOptions> & ICertificate & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
export declare const certificateService: CertificateService;
//# sourceMappingURL=certificateService.d.ts.map