import mongoose, { Document, Types } from 'mongoose';
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
export declare const ProjectProgress: mongoose.Model<IProjectProgress, {}, {}, {}, mongoose.Document<unknown, {}, IProjectProgress, {}, mongoose.DefaultSchemaOptions> & IProjectProgress & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProjectProgress>;
//# sourceMappingURL=ProjectProgress.d.ts.map