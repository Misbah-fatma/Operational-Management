import mongoose, { Document, Schema, Types } from 'mongoose';
import { PROJECT_DELAY_STATUSES, PROJECT_STATUSES } from '../constants';

export interface IProject extends Document {
  _id: Types.ObjectId;
  name: string;
  code: string;
  client?: string;
  contractNumber?: string;
  contractValue?: number;
  description?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  actualCost?: number;
  sla?: string;
  status: (typeof PROJECT_STATUSES)[number];
  progressPercent: number;
  plannedProgressPercent: number;
  actualProgressPercent: number;
  delayStatus: (typeof PROJECT_DELAY_STATUSES)[number];
  projectManager?: Types.ObjectId;
  remarks?: string;
  isActive: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    client: { type: String, trim: true },
    contractNumber: { type: String, trim: true },
    contractValue: { type: Number, default: 0 },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    sla: { type: String, trim: true },
    status: {
      type: String,
      enum: PROJECT_STATUSES,
      default: 'Proposal Stage',
    },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    plannedProgressPercent: { type: Number, default: 0, min: 0, max: 100 },
    actualProgressPercent: { type: Number, default: 0, min: 0, max: 100 },
    delayStatus: {
      type: String,
      enum: PROJECT_DELAY_STATUSES,
      default: 'On Track',
    },
    projectManager: { type: Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

projectSchema.index({ status: 1, isDeleted: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ name: 'text', code: 'text', client: 'text' });

export const Project = mongoose.model<IProject>('Project', projectSchema);
