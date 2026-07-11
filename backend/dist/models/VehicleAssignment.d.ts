import mongoose, { Document, Types } from 'mongoose';
import { FUEL_LEVELS, VEHICLE_CONDITIONS } from '../constants';
export interface IAssignmentPhoto {
    filename: string;
    originalName: string;
    path: string;
    url: string;
    type: string;
}
export interface IVehicleAssignment extends Document {
    _id: Types.ObjectId;
    assignmentId: string;
    vehicle: Types.ObjectId;
    assignedTo: Types.ObjectId;
    project?: Types.ObjectId;
    assignmentDate: Date;
    expectedReturnDate?: Date;
    assignedBy: Types.ObjectId;
    startingKm: number;
    fuelLevel: (typeof FUEL_LEVELS)[number];
    notes?: string;
    preAssignmentPhotos: IAssignmentPhoto[];
    status: 'Active' | 'Returned' | 'Overdue';
    returnDetails?: {
        returnDate: Date;
        finalKm: number;
        fuelLevel: (typeof FUEL_LEVELS)[number];
        vehicleCondition: (typeof VEHICLE_CONDITIONS)[number];
        returnPhotos: IAssignmentPhoto[];
        damagePhotos: IAssignmentPhoto[];
        remarks?: string;
        returnedBy: Types.ObjectId;
    };
    isDeleted: boolean;
}
export declare const VehicleAssignment: mongoose.Model<IVehicleAssignment, {}, {}, {}, mongoose.Document<unknown, {}, IVehicleAssignment, {}, mongoose.DefaultSchemaOptions> & IVehicleAssignment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IVehicleAssignment>;
//# sourceMappingURL=VehicleAssignment.d.ts.map