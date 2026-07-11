"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecutiveDashboard = void 0;
const executiveDashboardService_1 = require("../services/executiveDashboardService");
const ApiResponse_1 = require("../utils/ApiResponse");
const getExecutiveDashboard = async (req, res, next) => {
    try {
        const stats = await executiveDashboardService_1.executiveDashboardService.getStats();
        res.json(ApiResponse_1.ApiResponse.success('Executive dashboard retrieved', stats));
    }
    catch (error) {
        next(error);
    }
};
exports.getExecutiveDashboard = getExecutiveDashboard;
//# sourceMappingURL=executiveDashboardController.js.map