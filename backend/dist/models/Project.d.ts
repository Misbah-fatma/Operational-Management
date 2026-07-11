import mongoose, { Document, Types } from 'mongoose';
import { PROJECT_DELAY_STATUSES, PROJECT_STATUSES } from '../constants';
export interface IProject extends Document {
    _id: Types.ObjectId;
    name: string;
    code: string;
    client?: string;
    contractNumber?: string;
    contractValue?: number;
    description?: string;
    location?: string;
    startDate?: Date;
    endDate?: Date;
    budget?: number;
    actualCost?: number;
    sla?: string;
    status: (typeof PROJECT_STATUSES)[number];
    progressPercent: number;
    plannedProgressPercent: number;
    actualProgressPercent: number;
    delayStatus: (typeof PROJECT_DELAY_STATUSES)[number];
    projectManager?: Types.ObjectId;
    remarks?: string;
    isActive: boolean;
    isArchived: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    deletedBy?: Types.ObjectId;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Project: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject, {}, mongoose.DefaultSchemaOptions> & IProject & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProject>;
//# sourceMappingURL=Project.d.ts.map