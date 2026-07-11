import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { reportService, ReportFilters } from '../services/reportService';
import { ApiResponse } from '../utils/ApiResponse';
import { exportToExcel, exportToPdf } from '../utils/helpers';
import { REPORT_TYPES } from '../constants';

export const getReportTypes = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.json(ApiResponse.success('Report types retrieved', REPORT_TYPES));
  } catch (error) {
    next(error);
  }
};

export const generateReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filters: ReportFilters = {
      reportType: req.query.reportType as ReportFilters['reportType'],
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
      project: req.query.project as string,
      employee: req.query.employee as string,
      vehicle: req.query.vehicle as string,
      category: req.query.category as string,
      status: req.query.status as string,
      client: req.query.client as string,
      search: req.query.search as string,
    };
    const report = await reportService.generateReport(filters);
    res.json(ApiResponse.success('Report generated', report));
  } catch (error) {
    next(error);
  }
};

export const exportReportExcel = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filters: ReportFilters = {
      reportType: req.query.reportType as ReportFilters['reportType'],
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
      project: req.query.project as string,
      employee: req.query.employee as string,
      vehicle: req.query.vehicle as string,
      category: req.query.category as string,
      status: req.query.status as string,
      client: req.query.client as string,
      search: req.query.search as string,
    };
    const report = await reportService.generateReport(filters);
    const columns = report.columns.map((c, i) => ({
      header: c,
      key: `col${i}`,
      width: 20,
    }));
    const rows = report.rows.map((row) =>
      Object.fromEntries(row.map((cell, i) => [`col${i}`, cell])),
    );
    await exportToExcel(res, filters.reportType, columns, rows);
  } catch (error) {
    next(error);
  }
};

export const exportReportPdf = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const filters: ReportFilters = {
      reportType: req.query.reportType as ReportFilters['reportType'],
      dateFrom: req.query.dateFrom as string,
      dateTo: req.query.dateTo as string,
      project: req.query.project as string,
      employee: req.query.employee as string,
      vehicle: req.query.vehicle as string,
      category: req.query.category as string,
      status: req.query.status as string,
      client: req.query.client as string,
      search: req.query.search as string,
    };
    const report = await reportService.generateReport(filters);
    exportToPdf(res, filters.reportType, report.title, report.columns, report.rows);
  } catch (error) {
    next(error);
  }
};
