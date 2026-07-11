import mongoose, { Document, Types } from 'mongoose';
import { PROJECT_ASSIGNMENT_STATUSES, PROJECT_EMPLOYEE_ROLES, PROJECT_RESOURCE_TYPES } from '../constants';
export interface IProjectAssignment extends Document {
    _id: Types.ObjectId;
    assignmentId: string;
    project: Types.ObjectId;
    resourceType: (typeof PROJECT_RESOURCE_TYPES)[number];
    employee?: Types.ObjectId;
    vehicle?: Types.ObjectId;
    equipment?: Types.ObjectId;
    employeeRole?: (typeof PROJECT_EMPLOYEE_ROLES)[number];
    workPackage?: string;
    assignmentDate: Date;
    releaseDate?: Date;
    status: (typeof PROJECT_ASSIGNMENT_STATUSES)[number];
    remarks?: string;
    isDeleted: boolean;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProjectAssignment: mongoose.Model<IProjectAssignment, {}, {}, {}, mongoose.Document<unknown, {}, IProjectAssignment, {}, mongoose.DefaultSchemaOptions> & IProjectAssignment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IProjectAssignment>;
//# sourceMappingURL=ProjectAssignment.d.ts.map