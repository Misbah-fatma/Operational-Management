import mongoose, { Document, Schema, Types } from 'mongoose';
import { PROJECT_ISSUE_TYPES } from '../constants';

export interface IProjectIssue extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  type: (typeof PROJECT_ISSUE_TYPES)[number];
  title: string;
  description?: string;
  status: 'Open' | 'Closed';
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IProjectIssue>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    type: { type: String, enum: PROJECT_ISSUE_TYPES, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const ProjectIssue = mongoose.model<IProjectIssue>('ProjectIssue', issueSchema);
