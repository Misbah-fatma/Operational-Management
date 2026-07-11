"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const certificateRoutes_1 = __importDefault(require("./certificateRoutes"));
const vehicleRoutes_1 = __importDefault(require("./vehicleRoutes"));
const notificationRoutes_1 = __importDefault(require("./notificationRoutes"));
const projectRoutes_1 = __importDefault(require("./projectRoutes"));
const executiveDashboardRoutes_1 = __importDefault(require("./executiveDashboardRoutes"));
const reportRoutes_1 = __importDefault(require("./reportRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/certificates', certificateRoutes_1.default);
router.use('/vehicles', vehicleRoutes_1.default);
router.use('/notifications', notificationRoutes_1.default);
router.use('/projects', projectRoutes_1.default);
router.use('/executive', executiveDashboardRoutes_1.default);
router.use('/reports', reportRoutes_1.default);
router.get('/health', (_req, res) => {
    res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});
exports.default = router;
//# sourceMappingURL=index.js.map