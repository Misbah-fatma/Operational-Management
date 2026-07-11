"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const ApiResponse_1 = require("../utils/ApiResponse");
class AuthService {
    generateToken(user) {
        return jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, env_1.env.jwtSecret, {
            expiresIn: env_1.env.jwtExpiresIn,
        });
    }
    sanitizeUser(user) {
        const obj = user.toObject();
        delete obj.password;
        return obj;
    }
    async login(email, password) {
        const user = await User_1.User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user || !user.isActive) {
            throw new ApiResponse_1.ApiError(401, 'Invalid email or password');
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ApiResponse_1.ApiError(401, 'Invalid email or password');
        }
        user.lastLogin = new Date();
        await user.save();
        return {
            user: this.sanitizeUser(user),
            token: this.generateToken(user),
        };
    }
    async register(input, createdBy) {
        const existing = await User_1.User.findOne({ email: input.email.toLowerCase() });
        if (existing) {
            throw new ApiResponse_1.ApiError(400, 'Email already registered');
        }
        const user = await User_1.User.create({
            ...input,
            email: input.email.toLowerCase(),
            createdBy,
        });
        return {
            user: this.sanitizeUser(user),
            token: this.generateToken(user),
        };
    }
    async getProfile(userId) {
        const user = await User_1.User.findById(userId);
        if (!user)
            throw new ApiResponse_1.ApiError(404, 'User not found');
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, updates) {
        const user = await User_1.User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
        if (!user)
            throw new ApiResponse_1.ApiError(404, 'User not found');
        return this.sanitizeUser(user);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await User_1.User.findById(userId).select('+password');
        if (!user)
            throw new ApiResponse_1.ApiError(404, 'User not found');
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch)
            throw new ApiResponse_1.ApiError(400, 'Current password is incorrect');
        user.password = newPassword;
        await user.save();
    }
    async getUsers(filters) {
        const query = {};
        if (filters.role)
            query.role = filters.role;
        if (filters.isActive !== undefined)
            query.isActive = filters.isActive;
        if (filters.search) {
            query.$or = [
                { firstName: { $regex: filters.search, $options: 'i' } },
                { lastName: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
                { employeeId: { $regex: filters.search, $options: 'i' } },
            ];
        }
        return User_1.User.find(query).select('-password').sort({ firstName: 1 });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=authService.js.map