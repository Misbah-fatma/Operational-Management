import { Types } from 'mongoose';
import { Notification, INotification } from '../models/Notification';
import { PaginatedResult, PaginationOptions, buildPaginationMeta, buildSort } from '../utils/pagination';

export interface CreateNotificationInput {
  user: Types.ObjectId | string;
  title: string;
  message: string;
  type: INotification['type'];
  relatedEntity?: INotification['relatedEntity'];
  metadata?: Record<string, unknown>;
}

export class NotificationService {
  async create(input: CreateNotificationInput): Promise<INotification> {
    return Notification.create(input);
  }

  async createBulk(inputs: CreateNotificationInput[]): Promise<void> {
    if (inputs.length > 0) {
      await Notification.insertMany(inputs);
    }
  }

  async getUserNotifications(
    userId: string,
    pagination: PaginationOptions,
    unreadOnly = false,
  ): Promise<PaginatedResult<INotification>> {
    const filter: Record<string, unknown> = { user: userId };
    if (unreadOnly) filter.isRead = false;

    const [data, total] = await Promise.all([
      Notification.find(filter)
        .sort(buildSort(pagination.sortBy, pagination.sortOrder))
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit),
      Notification.countDocuments(filter),
    ]);

    return {
      data,
      pagination: buildPaginationMeta(pagination.page, pagination.limit, total),
    };
  }

  async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true, readAt: new Date() },
      { new: true },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({ user: userId, isRead: false });
  }

  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    const result = await Notification.deleteOne({ _id: notificationId, user: userId });
    return result.deletedCount > 0;
  }
}

export const notificationService = new NotificationService();
