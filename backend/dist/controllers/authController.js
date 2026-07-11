"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.changePassword = exports.updateProfile = exports.getProfile = exports.register = exports.login = void 0;
const authService_1 = require("../services/authService");
const ApiResponse_1 = require("../utils/ApiResponse");
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService_1.authService.login(email, password);
        res.json(ApiResponse_1.ApiResponse.success('Login successful', result));
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const register = async (req, res, next) => {
    try {
        const result = await authService_1.authService.register(req.body, req.user?._id?.toString());
        res.status(201).json(ApiResponse_1.ApiResponse.success('User registered successfully', result));
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const getProfile = async (req, res, next) => {
    try {
        const user = await authService_1.authService.getProfile(req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Profile retrieved', user));
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const user = await authService_1.authService.updateProfile(req.user._id.toString(), req.body);
        res.json(ApiResponse_1.ApiResponse.success('Profile updated', user));
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        await authService_1.authService.changePassword(req.user._id.toString(), currentPassword, newPassword);
        res.json(ApiResponse_1.ApiResponse.success('Password changed successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.changePassword = changePassword;
const getUsers = async (req, res, next) => {
    try {
        const users = await authService_1.authService.getUsers({
            role: req.query.role,
            search: req.query.search,
            isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        });
        res.json(ApiResponse_1.ApiResponse.success('Users retrieved', users));
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
//# sourceMappingURL=authController.js.map