import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMilestone extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  name: string;
  description?: string;
  plannedDate?: Date;
  actualDate?: Date;
  status: string;
  progressPercent: number;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const milestoneSchema = new Schema<IMilestone>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    plannedDate: { type: Date },
    actualDate: { type: Date },
    status: { type: String, default: 'Pending', trim: true },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const Milestone = mongoose.model<IMilestone>('Milestone', milestoneSchema);
