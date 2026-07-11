import mongoose, { Document, Types } from 'mongoose';
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
export declare const ProjectDocument: mongoose.Model<IProjectDocument, {}, {}, {}, mongoose.Document<unknown, {}, IProjectDocument, {}, mongoose.DefaultSchemaOptions> & IProjectDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProjectDocument>;
//# sourceMappingURL=ProjectDocument.d.ts.map