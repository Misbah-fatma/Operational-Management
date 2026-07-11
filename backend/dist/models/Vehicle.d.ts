import mongoose, { Document, Types } from 'mongoose';
import { FUEL_TYPES, VEHICLE_STATUSES } from '../constants';
export interface IVehicle extends Omit<Document, 'model'> {
    _id: Types.ObjectId;
    vehicleId: string;
    vehicleName: string;
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    vin?: string;
    insuranceNumber?: string;
    insuranceExpiryDate?: Date;
    mvpiExpiryDate?: Date;
    currentKm: number;
    fuelType: (typeof FUEL_TYPES)[number];
    currentStatus: (typeof VEHICLE_STATUSES)[number];
    assignedProject?: Types.ObjectId;
    assignedEmployee?: Types.ObjectId;
    remarks?: string;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId;
}
export declare const Vehicle: mongoose.Model<IVehicle, {}, {}, {}, mongoose.Document<unknown, {}, IVehicle, {}, mongoose.DefaultSchemaOptions> & IVehicle & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IVehicle>;
//# sourceMappingURL=Vehicle.d.ts.map