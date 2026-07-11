import mongoose, { Document, Schema, Types } from 'mongoose';
import {
  PROJECT_ASSIGNMENT_STATUSES,
  PROJECT_EMPLOYEE_ROLES,
  PROJECT_RESOURCE_TYPES,
} from '../constants';

export interface IProjectAssignment extends Document {
  _id: Types.ObjectId;
  assignmentId: string;
  project: Types.ObjectId;
  resourceType: (typeof PROJECT_RESOURCE_TYPES)[number];
  employee?: Types.ObjectId;
  vehicle?: Types.ObjectId;
  equipment?: Types.ObjectId;
  employeeRole?: (typeof PROJECT_EMPLOYEE_ROLES)[number];
  workPackage?: string;
  assignmentDate: Date;
  releaseDate?: Date;
  status: (typeof PROJECT_ASSIGNMENT_STATUSES)[number];
  remarks?: string;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IProjectAssignment>(
  {
    assignmentId: { type: String, required: true, unique: true, uppercase: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    resourceType: { type: String, enum: PROJECT_RESOURCE_TYPES, required: true },
    employee: { type: Schema.Types.ObjectId, ref: 'User' },
    vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    equipment: { type: Schema.Types.ObjectId, ref: 'Equipment' },
    employeeRole: { type: String, enum: PROJECT_EMPLOYEE_ROLES },
    workPackage: { type: String, trim: true },
    assignmentDate: { type: Date, required: true },
    releaseDate: { type: Date },
    status: {
      type: String,
      enum: PROJECT_ASSIGNMENT_STATUSES,
      default: 'Active',
    },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

assignmentSchema.index({ resourceType: 1, status: 1, employee: 1 });
assignmentSchema.index({ resourceType: 1, status: 1, vehicle: 1 });
assignmentSchema.index({ resourceType: 1, status: 1, equipment: 1 });

export const ProjectAssignment = mongoose.model<IProjectAssignment>(
  'ProjectAssignment',
  assignmentSchema,
);
