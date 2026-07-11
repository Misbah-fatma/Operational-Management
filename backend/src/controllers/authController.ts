import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { authService } from '../services/authService';
import { ApiResponse } from '../utils/ApiResponse';

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(ApiResponse.success('Login successful', result));
  } catch (error) {
    next(error);
  }
};

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body, req.user?._id?.toString());
    res.status(201).json(ApiResponse.success('User registered successfully', result));
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getProfile(req.user!._id.toString());
    res.json(ApiResponse.success('Profile retrieved', user));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.updateProfile(req.user!._id.toString(), req.body);
    res.json(ApiResponse.success('Profile updated', user));
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user!._id.toString(), currentPassword, newPassword);
    res.json(ApiResponse.success('Password changed successfully'));
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await authService.getUsers({
      role: req.query.role as never,
      search: req.query.search as string,
      isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
    });
    res.json(ApiResponse.success('Users retrieved', users));
  } catch (error) {
    next(error);
  }
};
