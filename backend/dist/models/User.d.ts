import mongoose, { Document, Types } from 'mongoose';
import { Role } from '../constants';
export interface IUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    phone?: string;
    department?: string;
    employeeId?: string;
    isActive: boolean;
    lastLogin?: Date;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
    fullName: string;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=User.d.ts.map