import mongoose, { Document, Schema, Types } from 'mongoose';
import { PROJECT_EMPLOYEE_ROLES } from '../constants';

export interface IProjectTeam extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  user: Types.ObjectId;
  role: (typeof PROJECT_EMPLOYEE_ROLES)[number] | 'manager';
  joinedDate: Date;
  leftDate?: Date;
  status: 'Active' | 'Inactive';
  remarks?: string;
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<IProjectTeam>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: [...PROJECT_EMPLOYEE_ROLES, 'manager'],
      required: true,
    },
    joinedDate: { type: Date, required: true },
    leftDate: { type: Date },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

teamSchema.index({ project: 1, user: 1 });

export const ProjectTeam = mongoose.model<IProjectTeam>('ProjectTeam', teamSchema);
