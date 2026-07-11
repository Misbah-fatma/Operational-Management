import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User, IUser } from '../models/User';
import { ApiError } from '../utils/ApiResponse';
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

export class AuthService {
  private generateToken(user: IUser): string {
    return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  private sanitizeUser(user: IUser): Partial<IUser> {
    const obj = user.toObject();
    delete (obj as { password?: string }).password;
    return obj;
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.isActive) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    user.lastLogin = new Date();
    await user.save();

    return {
      user: this.sanitizeUser(user),
      token: this.generateToken(user),
    };
  }

  async register(input: RegisterInput, createdBy?: string): Promise<LoginResult> {
    const existing = await User.findOne({ email: input.email.toLowerCase() });
    if (existing) {
      throw new ApiError(400, 'Email already registered');
    }

    const user = await User.create({
      ...input,
      email: input.email.toLowerCase(),
      createdBy,
    });

    return {
      user: this.sanitizeUser(user),
      token: this.generateToken(user),
    };
  }

  async getProfile(userId: string): Promise<Partial<IUser>> {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    return this.sanitizeUser(user);
  }

  async updateProfile(
    userId: string,
    updates: Partial<Pick<IUser, 'firstName' | 'lastName' | 'phone' | 'department'>>,
  ): Promise<Partial<IUser>> {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
    if (!user) throw new ApiError(404, 'User not found');
    return this.sanitizeUser(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new ApiError(404, 'User not found');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

    user.password = newPassword;
    await user.save();
  }

  async getUsers(filters: { role?: Role; search?: string; isActive?: boolean }) {
    const query: Record<string, unknown> = {};
    if (filters.role) query.role = filters.role;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { employeeId: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return User.find(query).select('-password').sort({ firstName: 1 });
  }
}

export const authService = new AuthService();
