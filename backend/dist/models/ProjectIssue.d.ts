import mongoose, { Document, Types } from 'mongoose';
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
export declare const ProjectIssue: mongoose.Model<IProjectIssue, {}, {}, {}, mongoose.Document<unknown, {}, IProjectIssue, {}, mongoose.DefaultSchemaOptions> & IProjectIssue & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProjectIssue>;
//# sourceMappingURL=ProjectIssue.d.ts.map