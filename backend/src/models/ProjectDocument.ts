import mongoose, { Document, Schema, Types } from 'mongoose';
import { PROJECT_DOCUMENT_CATEGORIES } from '../constants';

export interface IProjectDocumentFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export interface IProjectDocument extends Document {
  _id: Types.ObjectId;
  project: Types.ObjectId;
  category: (typeof PROJECT_DOCUMENT_CATEGORIES)[number];
  fileName: string;
  version: string;
  notes?: string;
  file: IProjectDocumentFile;
  isDeleted: boolean;
  uploadedBy?: Types.ObjectId;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IProjectDocumentFile>(
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

const documentSchema = new Schema<IProjectDocument>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    category: { type: String, enum: PROJECT_DOCUMENT_CATEGORIES, required: true },
    fileName: { type: String, required: true, trim: true },
    version: { type: String, default: '1.0', trim: true },
    notes: { type: String, trim: true },
    file: { type: fileSchema, required: true },
    isDeleted: { type: Boolean, default: false },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const ProjectDocument = mongoose.model<IProjectDocument>('ProjectDocument', documentSchema);
