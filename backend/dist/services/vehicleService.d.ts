import { Types } from 'mongoose';
import { IVehicle } from '../models/Vehicle';
import { IVehicleAssignment } from '../models/VehicleAssignment';
import { IVehicleMaintenance } from '../models/VehicleMaintenance';
import { PaginationOptions, PaginatedResult } from '../utils/pagination';
export interface VehicleFilters {
    search?: string;
    status?: string;
    fuelType?: string;
    assignedProject?: string;
    assignedEmployee?: string;
}
export interface CreateVehicleInput {
    vehicleName: string;
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    vin?: string;
    insuranceNumber?: string;
    insuranceExpiryDate?: Date;
    mvpiExpiryDate?: Date;
    currentKm?: number;
    fuelType: IVehicle['fuelType'];
    assignedProject?: string;
    remarks?: string;
    createdBy: string;
}
export interface CreateAssignmentInput {
    vehicle: string;
    assignedTo: string;
    project?: string;
    assignmentDate?: Date;
    expectedReturnDate?: Date;
    startingKm: number;
    fuelLevel: IVehicleAssignment['fuelLevel'];
    notes?: string;
    assignedBy: string;
}
export interface ReturnVehicleInput {
    finalKm: number;
    fuelLevel: IVehicleAssignment['fuelLevel'];
    vehicleCondition: NonNullable<IVehicleAssignment['returnDetails']>['vehicleCondition'];
    remarks?: string;
    returnedBy: string;
}
export declare class VehicleService {
    private vehiclePopulate;
    private assignmentPopulate;
    private buildVehicleFilter;
    getVehicles(filters: VehicleFilters, pagination: PaginationOptions): Promise<PaginatedResult<IVehicle>>;
    getVehicleById(id: string): Promise<IVehicle>;
    createVehicle(input: CreateVehicleInput): Promise<IVehicle>;
    updateVehicle(id: string, input: Partial<CreateVehicleInput>, updatedBy: string): Promise<IVehicle>;
    deleteVehicle(id: string, deletedBy: string): Promise<void>;
    createAssignment(input: CreateAssignmentInput, photos: Record<string, Express.Multer.File[]>): Promise<IVehicleAssignment>;
    returnVehicle(assignmentId: string, input: ReturnVehicleInput, photos: Record<string, Express.Multer.File[]>): Promise<IVehicleAssignment>;
    getAssignments(filters: {
        vehicle?: string;
        assignedTo?: string;
        status?: string;
        project?: string;
    }, pagination: PaginationOptions): Promise<PaginatedResult<IVehicleAssignment>>;
    getAssignmentById(id: string): Promise<IVehicleAssignment>;
    createMaintenance(input: Partial<IVehicleMaintenance> & {
        vehicle: string;
        createdBy: string;
    }): Promise<IVehicleMaintenance>;
    getMaintenanceHistory(vehicleId: string, pagination: PaginationOptions): Promise<{
        data: (import("mongoose").Document<unknown, {}, IVehicleMaintenance, {}, import("mongoose").DefaultSchemaOptions> & IVehicleMaintenance & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getFleetDashboard(): Promise<{
        total: number;
        available: number;
        assigned: number;
        underMaintenance: number;
        insuranceExpiringSoon: number;
        mvpiExpiringSoon: number;
        utilization: number;
        statusBreakdown: {
            status: any;
            count: any;
        }[];
        kmUsageSummary: any;
        activeAssignments: (import("mongoose").Document<unknown, {}, IVehicleAssignment, {}, import("mongoose").DefaultSchemaOptions> & IVehicleAssignment & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    processVehicleAlerts(): Promise<number>;
    getExportData(filters: VehicleFilters): Promise<(import("mongoose").Document<unknown, {}, IVehicle, {}, import("mongoose").DefaultSchemaOptions> & IVehicle & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
export declare const vehicleService: VehicleService;
//# sourceMappingURL=vehicleService.d.ts.map