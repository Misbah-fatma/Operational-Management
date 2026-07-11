import mongoose, { Document, Types } from 'mongoose';
export interface IMilestone extends Document {
    _id: Types.ObjectId;
    project: Types.ObjectId;
    name: string;
    description?: string;
    plannedDate?: Date;
    actualDate?: Date;
    status: string;
    progressPercent: number;
    isDeleted: boolean;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Milestone: mongoose.Model<IMilestone, {}, {}, {}, mongoose.Document<unknown, {}, IMilestone, {}, mongoose.DefaultSchemaOptions> & IMilestone & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMilestone>;
//# sourceMappingURL=Milestone.d.ts.map