import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { notificationService } from '../services/notificationService';
import { ApiResponse } from '../utils/ApiResponse';
import { getPagination } from '../utils/pagination';
import { getParam } from '../utils/params';

export const getNotifications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await notificationService.getUserNotifications(
      req.user!._id.toString(),
      getPagination(req),
      req.query.unreadOnly === 'true',
    );
    res.json(ApiResponse.success('Notifications retrieved', result.data, { pagination: result.pagination }));
  } catch (error) {
    next(error);
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const count = await notificationService.getUnreadCount(req.user!._id.toString());
    res.json(ApiResponse.success('Unread count retrieved', { count }));
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notification = await notificationService.markAsRead(
      getParam(req, 'id'),
      req.user!._id.toString(),
    );
    res.json(ApiResponse.success('Notification marked as read', notification));
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await notificationService.markAllAsRead(req.user!._id.toString());
    res.json(ApiResponse.success('All notifications marked as read'));
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await notificationService.deleteNotification(getParam(req, 'id'), req.user!._id.toString());
    res.json(ApiResponse.success('Notification deleted'));
  } catch (error) {
    next(error);
  }
};
