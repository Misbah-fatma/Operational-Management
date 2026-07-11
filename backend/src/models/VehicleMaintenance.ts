import mongoose, { Document, Schema, Types } from 'mongoose';
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

const vehicleMaintenanceSchema = new Schema<IVehicleMaintenance>(
  {
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    maintenanceType: { type: String, enum: MAINTENANCE_TYPES, required: true },
    description: { type: String, required: true, trim: true },
    scheduledDate: { type: Date },
    completedDate: { type: Date },
    cost: { type: Number, default: 0 },
    vendor: { type: String, trim: true },
    odometerReading: { type: Number },
    nextDueDate: { type: Date },
    notes: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

vehicleMaintenanceSchema.index({ vehicle: 1 });
vehicleMaintenanceSchema.index({ maintenanceType: 1 });
vehicleMaintenanceSchema.index({ nextDueDate: 1 });

export const VehicleMaintenance = mongoose.model<IVehicleMaintenance>(
  'VehicleMaintenance',
  vehicleMaintenanceSchema,
);
