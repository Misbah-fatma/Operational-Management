import { REPORT_TYPES } from '../constants';
export interface ReportFilters {
    reportType: (typeof REPORT_TYPES)[number];
    dateFrom?: string;
    dateTo?: string;
    project?: string;
    employee?: string;
    vehicle?: string;
    category?: string;
    status?: string;
    client?: string;
    search?: string;
}
export declare class ReportService {
    private dateFilter;
    generateReport(filters: ReportFilters): Promise<{
        title: string;
        columns: string[];
        rows: string[][];
        data: (import("mongoose").Document<unknown, {}, import("../models").IProject, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IProject & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    } | {
        title: string;
        columns: string[];
        rows: string[][];
        data: (import("mongoose").Document<unknown, {}, import("../models").ICertificate, {}, import("mongoose").DefaultSchemaOptions> & import("../models").ICertificate & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    } | {
        title: string;
        columns: string[];
        rows: string[][];
        data: (import("mongoose").Document<unknown, {}, import("../models").IVehicleAssignment, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IVehicleAssignment & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    } | {
        title: string;
        columns: string[];
        rows: string[][];
        data: (import("mongoose").Document<unknown, {}, import("../models").IVehicle, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IVehicle & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    } | {
        title: string;
        columns: string[];
        rows: string[][];
        data: (import("mongoose").Document<unknown, {}, import("../models").IVehicleMaintenance, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IVehicleMaintenance & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    } | {
        title: string;
        columns: string[];
        rows: string[][];
        data: (import("mongoose").Document<unknown, {}, import("../models").IProjectAssignment, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IProjectAssignment & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    } | {
        title: string;
        columns: string[];
        rows: string[][];
        data: (import("mongoose").Document<unknown, {}, import("../models").IProjectFinancial, {}, import("mongoose").DefaultSchemaOptions> & import("../models").IProjectFinancial & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    } | {
        columns: never[];
        rows: never[];
        title: string;
    }>;
    private projectReport;
    private certificateReport;
    private vehicleAssignmentReport;
    private vehicleInspectionReport;
    private vehicleMaintenanceReport;
    private manpowerAllocationReport;
    private resourceAllocationReport;
    private financialSummaryReport;
}
export declare const reportService: ReportService;
//# sourceMappingURL=reportService.d.ts.map