import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { executiveDashboardService } from '../services/executiveDashboardService';
import { ApiResponse } from '../utils/ApiResponse';

export const getExecutiveDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await executiveDashboardService.getStats();
    res.json(ApiResponse.success('Executive dashboard retrieved', stats));
  } catch (error) {
    next(error);
  }
};
