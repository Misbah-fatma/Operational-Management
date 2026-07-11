import mongoose, { Document, Types } from 'mongoose';
import { PROJECT_EMPLOYEE_ROLES } from '../constants';
export interface IProjectTeam extends Document {
    _id: Types.ObjectId;
    project: Types.ObjectId;
    user: Types.ObjectId;
    role: (typeof PROJECT_EMPLOYEE_ROLES)[number] | 'manager';
    joinedDate: Date;
    leftDate?: Date;
    status: 'Active' | 'Inactive';
    remarks?: string;
    isDeleted: boolean;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProjectTeam: mongoose.Model<IProjectTeam, {}, {}, {}, mongoose.Document<unknown, {}, IProjectTeam, {}, mongoose.DefaultSchemaOptions> & IProjectTeam & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProjectTeam>;
//# sourceMappingURL=ProjectTeam.d.ts.map