import mongoose, { Document, Schema, Types } from 'mongoose';
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

const vehicleSchema = new Schema<IVehicle>(
  {
    vehicleId: { type: String, required: true, unique: true, trim: true },
    vehicleName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    vin: { type: String, trim: true },
    insuranceNumber: { type: String, trim: true },
    insuranceExpiryDate: { type: Date },
    mvpiExpiryDate: { type: Date },
    currentKm: { type: Number, default: 0 },
    fuelType: { type: String, enum: FUEL_TYPES, required: true },
    currentStatus: { type: String, enum: VEHICLE_STATUSES, default: 'Available' },
    assignedProject: { type: Schema.Types.ObjectId, ref: 'Project' },
    assignedEmployee: { type: Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

vehicleSchema.index({ vehicleId: 1 });
vehicleSchema.index({ currentStatus: 1 });
vehicleSchema.index({ isDeleted: 1 });
vehicleSchema.index({ vehicleName: 'text', registrationNumber: 'text' });

export const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
