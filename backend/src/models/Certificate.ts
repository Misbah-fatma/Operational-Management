import mongoose, { Document, Schema, Types } from 'mongoose';
import { CERTIFICATE_CATEGORIES, CERTIFICATE_STATUSES } from '../constants';

export interface ICertificateFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export interface ICertificate extends Document {
  _id: Types.ObjectId;
  certificateId: string;
  certificateNumber: string;
  certificateName: string;
  category: (typeof CERTIFICATE_CATEGORIES)[number];
  relatedEmployee?: Types.ObjectId;
  relatedEquipment?: Types.ObjectId;
  relatedVehicle?: Types.ObjectId;
  relatedProject?: Types.ObjectId;
  issueDate: Date;
  expiryDate: Date;
  renewalDate?: Date;
  issuingAuthority: string;
  status: (typeof CERTIFICATE_STATUSES)[number];
  certificateFile?: ICertificateFile;
  remarks?: string;
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
}

const certificateFileSchema = new Schema<ICertificateFile>(
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

const certificateSchema = new Schema<ICertificate>(
  {
    certificateId: { type: String, required: true, unique: true, trim: true },
    certificateNumber: { type: String, required: true, trim: true },
    certificateName: { type: String, required: true, trim: true },
    category: { type: String, enum: CERTIFICATE_CATEGORIES, required: true },
    relatedEmployee: { type: Schema.Types.ObjectId, ref: 'User' },
    relatedEquipment: { type: Schema.Types.ObjectId, ref: 'Equipment' },
    relatedVehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    relatedProject: { type: Schema.Types.ObjectId, ref: 'Project' },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    renewalDate: { type: Date },
    issuingAuthority: { type: String, required: true, trim: true },
    status: { type: String, enum: CERTIFICATE_STATUSES, default: 'Active' },
    certificateFile: certificateFileSchema,
    remarks: { type: String, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ category: 1, status: 1 });
certificateSchema.index({ expiryDate: 1 });
certificateSchema.index({ isDeleted: 1 });
certificateSchema.index({ certificateName: 'text', certificateNumber: 'text' });

export const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);
