import mongoose, { Document, Types } from 'mongoose';
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
export declare const Certificate: mongoose.Model<ICertificate, {}, {}, {}, mongoose.Document<unknown, {}, ICertificate, {}, mongoose.DefaultSchemaOptions> & ICertificate & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICertificate>;
//# sourceMappingURL=Certificate.d.ts.map