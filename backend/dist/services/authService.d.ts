import { IUser } from '../models/User';
import { Role } from '../constants';
export interface LoginResult {
    user: Partial<IUser>;
    token: string;
}
export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: Role;
    phone?: string;
    department?: string;
    employeeId?: string;
}
export declare class AuthService {
    private generateToken;
    private sanitizeUser;
    login(email: string, password: string): Promise<LoginResult>;
    register(input: RegisterInput, createdBy?: string): Promise<LoginResult>;
    getProfile(userId: string): Promise<Partial<IUser>>;
    updateProfile(userId: string, updates: Partial<Pick<IUser, 'firstName' | 'lastName' | 'phone' | 'department'>>): Promise<Partial<IUser>>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    getUsers(filters: {
        role?: Role;
        search?: string;
        isActive?: boolean;
    }): Promise<(import("mongoose").Document<unknown, {}, IUser, {}, import("mongoose").DefaultSchemaOptions> & IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map