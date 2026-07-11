"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportReportPdf = exports.exportReportExcel = exports.generateReport = exports.getReportTypes = void 0;
const reportService_1 = require("../services/reportService");
const ApiResponse_1 = require("../utils/ApiResponse");
const helpers_1 = require("../utils/helpers");
const constants_1 = require("../constants");
const getReportTypes = async (_req, res, next) => {
    try {
        res.json(ApiResponse_1.ApiResponse.success('Report types retrieved', constants_1.REPORT_TYPES));
    }
    catch (error) {
        next(error);
    }
};
exports.getReportTypes = getReportTypes;
const generateReport = async (req, res, next) => {
    try {
        const filters = {
            reportType: req.query.reportType,
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo,
            project: req.query.project,
            employee: req.query.employee,
            vehicle: req.query.vehicle,
            category: req.query.category,
            status: req.query.status,
            client: req.query.client,
            search: req.query.search,
        };
        const report = await reportService_1.reportService.generateReport(filters);
        res.json(ApiResponse_1.ApiResponse.success('Report generated', report));
    }
    catch (error) {
        next(error);
    }
};
exports.generateReport = generateReport;
const exportReportExcel = async (req, res, next) => {
    try {
        const filters = {
            reportType: req.query.reportType,
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo,
            project: req.query.project,
            employee: req.query.employee,
            vehicle: req.query.vehicle,
            category: req.query.category,
            status: req.query.status,
            client: req.query.client,
            search: req.query.search,
        };
        const report = await reportService_1.reportService.generateReport(filters);
        const columns = report.columns.map((c, i) => ({
            header: c,
            key: `col${i}`,
            width: 20,
        }));
        const rows = report.rows.map((row) => Object.fromEntries(row.map((cell, i) => [`col${i}`, cell])));
        await (0, helpers_1.exportToExcel)(res, filters.reportType, columns, rows);
    }
    catch (error) {
        next(error);
    }
};
exports.exportReportExcel = exportReportExcel;
const exportReportPdf = async (req, res, next) => {
    try {
        const filters = {
            reportType: req.query.reportType,
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo,
            project: req.query.project,
            employee: req.query.employee,
            vehicle: req.query.vehicle,
            category: req.query.category,
            status: req.query.status,
            client: req.query.client,
            search: req.query.search,
        };
        const report = await reportService_1.reportService.generateReport(filters);
        (0, helpers_1.exportToPdf)(res, filters.reportType, report.title, report.columns, report.rows);
    }
    catch (error) {
        next(error);
    }
};
exports.exportReportPdf = exportReportPdf;
//# sourceMappingURL=reportController.js.map