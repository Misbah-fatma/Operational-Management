import { Types } from 'mongoose';
import { INotification } from '../models/Notification';
import { PaginatedResult, PaginationOptions } from '../utils/pagination';
export interface CreateNotificationInput {
    user: Types.ObjectId | string;
    title: string;
    message: string;
    type: INotification['type'];
    relatedEntity?: INotification['relatedEntity'];
    metadata?: Record<string, unknown>;
}
export declare class NotificationService {
    create(input: CreateNotificationInput): Promise<INotification>;
    createBulk(inputs: CreateNotificationInput[]): Promise<void>;
    getUserNotifications(userId: string, pagination: PaginationOptions, unreadOnly?: boolean): Promise<PaginatedResult<INotification>>;
    markAsRead(notificationId: string, userId: string): Promise<INotification | null>;
    markAllAsRead(userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    deleteNotification(notificationId: string, userId: string): Promise<boolean>;
}
export declare const notificationService: NotificationService;
//# sourceMappingURL=notificationService.d.ts.map