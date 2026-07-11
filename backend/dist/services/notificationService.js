"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const Notification_1 = require("../models/Notification");
const pagination_1 = require("../utils/pagination");
class NotificationService {
    async create(input) {
        return Notification_1.Notification.create(input);
    }
    async createBulk(inputs) {
        if (inputs.length > 0) {
            await Notification_1.Notification.insertMany(inputs);
        }
    }
    async getUserNotifications(userId, pagination, unreadOnly = false) {
        const filter = { user: userId };
        if (unreadOnly)
            filter.isRead = false;
        const [data, total] = await Promise.all([
            Notification_1.Notification.find(filter)
                .sort((0, pagination_1.buildSort)(pagination.sortBy, pagination.sortOrder))
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit),
            Notification_1.Notification.countDocuments(filter),
        ]);
        return {
            data,
            pagination: (0, pagination_1.buildPaginationMeta)(pagination.page, pagination.limit, total),
        };
    }
    async markAsRead(notificationId, userId) {
        return Notification_1.Notification.findOneAndUpdate({ _id: notificationId, user: userId }, { isRead: true, readAt: new Date() }, { new: true });
    }
    async markAllAsRead(userId) {
        await Notification_1.Notification.updateMany({ user: userId, isRead: false }, { isRead: true, readAt: new Date() });
    }
    async getUnreadCount(userId) {
        return Notification_1.Notification.countDocuments({ user: userId, isRead: false });
    }
    async deleteNotification(notificationId, userId) {
        const result = await Notification_1.Notification.deleteOne({ _id: notificationId, user: userId });
        return result.deletedCount > 0;
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
//# sourceMappingURL=notificationService.js.map