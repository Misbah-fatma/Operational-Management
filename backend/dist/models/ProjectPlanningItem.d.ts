import mongoose, { Document, Types } from 'mongoose';
import { PROJECT_PLANNING_TYPES } from '../constants';
export interface IProjectPlanningItem extends Document {
    _id: Types.ObjectId;
    project: Types.ObjectId;
    type: (typeof PROJECT_PLANNING_TYPES)[number];
    name: string;
    description?: string;
    plannedDate?: Date;
    actualDate?: Date;
    status: string;
    progressPercent: number;
    parentId?: Types.ObjectId;
    isDeleted: boolean;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProjectPlanningItem: mongoose.Model<IProjectPlanningItem, {}, {}, {}, mongoose.Document<unknown, {}, IProjectPlanningItem, {}, mongoose.DefaultSchemaOptions> & IProjectPlanningItem & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProjectPlanningItem>;
//# sourceMappingURL=ProjectPlanningItem.d.ts.map