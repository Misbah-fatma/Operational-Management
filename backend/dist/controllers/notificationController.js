"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getUnreadCount = exports.getNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const ApiResponse_1 = require("../utils/ApiResponse");
const pagination_1 = require("../utils/pagination");
const params_1 = require("../utils/params");
const getNotifications = async (req, res, next) => {
    try {
        const result = await notificationService_1.notificationService.getUserNotifications(req.user._id.toString(), (0, pagination_1.getPagination)(req), req.query.unreadOnly === 'true');
        res.json(ApiResponse_1.ApiResponse.success('Notifications retrieved', result.data, { pagination: result.pagination }));
    }
    catch (error) {
        next(error);
    }
};
exports.getNotifications = getNotifications;
const getUnreadCount = async (req, res, next) => {
    try {
        const count = await notificationService_1.notificationService.getUnreadCount(req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Unread count retrieved', { count }));
    }
    catch (error) {
        next(error);
    }
};
exports.getUnreadCount = getUnreadCount;
const markAsRead = async (req, res, next) => {
    try {
        const notification = await notificationService_1.notificationService.markAsRead((0, params_1.getParam)(req, 'id'), req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Notification marked as read', notification));
    }
    catch (error) {
        next(error);
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res, next) => {
    try {
        await notificationService_1.notificationService.markAllAsRead(req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('All notifications marked as read'));
    }
    catch (error) {
        next(error);
    }
};
exports.markAllAsRead = markAllAsRead;
const deleteNotification = async (req, res, next) => {
    try {
        await notificationService_1.notificationService.deleteNotification((0, params_1.getParam)(req, 'id'), req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Notification deleted'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteNotification = deleteNotification;
//# sourceMappingURL=notificationController.js.map