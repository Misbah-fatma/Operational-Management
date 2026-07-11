import mongoose, { Document, Schema, Types } from 'mongoose';
import { PROJECT_PROGRESS_TYPES } from '../constants';

export interface IProgressAttachment {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export interface IProjectProgress extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  updateType: (typeof PROJECT_PROGRESS_TYPES)[number];
  date: Date;
  progressPercent: number;
  summary?: string;
  issues?: string;
  attachments: IProgressAttachment[];
  isDeleted: boolean;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema<IProgressAttachment>(
  {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    url: String,
  },
  { _id: false },
);

const progressSchema = new Schema<IProjectProgress>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    updateType: { type: String, enum: PROJECT_PROGRESS_TYPES, required: true },
    date: { type: Date, required: true },
    progressPercent: { type: Number, required: true, min: 0, max: 100 },
    summary: { type: String, trim: true },
    issues: { type: String, trim: true },
    attachments: [attachmentSchema],
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const ProjectProgress = mongoose.model<IProjectProgress>('ProjectProgress', progressSchema);
