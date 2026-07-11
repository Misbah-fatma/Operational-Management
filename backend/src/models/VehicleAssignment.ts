import mongoose, { Document, Schema, Types } from 'mongoose';
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

const photoSchema = new Schema<IAssignmentPhoto>(
  {
    filename: String,
    originalName: String,
    path: String,
    url: String,
    type: String,
  },
  { _id: false },
);

const vehicleAssignmentSchema = new Schema<IVehicleAssignment>(
  {
    assignmentId: { type: String, required: true, unique: true, trim: true },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    assignmentDate: { type: Date, required: true, default: Date.now },
    expectedReturnDate: { type: Date },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startingKm: { type: Number, required: true },
    fuelLevel: { type: String, enum: FUEL_LEVELS, required: true },
    notes: { type: String, trim: true },
    preAssignmentPhotos: [photoSchema],
    status: { type: String, enum: ['Active', 'Returned', 'Overdue'], default: 'Active' },
    returnDetails: {
      returnDate: Date,
      finalKm: Number,
      fuelLevel: { type: String, enum: FUEL_LEVELS },
      vehicleCondition: { type: String, enum: VEHICLE_CONDITIONS },
      returnPhotos: [photoSchema],
      damagePhotos: [photoSchema],
      remarks: String,
      returnedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

vehicleAssignmentSchema.index({ assignmentId: 1 });
vehicleAssignmentSchema.index({ vehicle: 1, status: 1 });
vehicleAssignmentSchema.index({ assignedTo: 1, status: 1 });
vehicleAssignmentSchema.index({ status: 1 });

export const VehicleAssignment = mongoose.model<IVehicleAssignment>(
  'VehicleAssignment',
  vehicleAssignmentSchema,
);
