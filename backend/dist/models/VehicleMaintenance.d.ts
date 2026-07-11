import mongoose, { Document, Types } from 'mongoose';
import { MAINTENANCE_TYPES } from '../constants';
export interface IVehicleMaintenance extends Document {
    _id: Types.ObjectId;
    vehicle: Types.ObjectId;
    maintenanceType: (typeof MAINTENANCE_TYPES)[number];
    description: string;
    scheduledDate?: Date;
    completedDate?: Date;
    cost: number;
    vendor?: string;
    odometerReading?: number;
    nextDueDate?: Date;
    notes?: string;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    isDeleted: boolean;
}
export declare const VehicleMaintenance: mongoose.Model<IVehicleMaintenance, {}, {}, {}, mongoose.Document<unknown, {}, IVehicleMaintenance, {}, mongoose.DefaultSchemaOptions> & IVehicleMaintenance & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IVehicleMaintenance>;
//# sourceMappingURL=VehicleMaintenance.d.ts.map