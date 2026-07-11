"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executiveDashboardService = exports.ExecutiveDashboardService = void 0;
const models_1 = require("../models");
const certificateService_1 = require("./certificateService");
const vehicleService_1 = require("./vehicleService");
const projectService_1 = require("./projectService");
class ExecutiveDashboardService {
    async getStats() {
        const now = new Date();
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const baseProjectFilter = { isDeleted: false, isArchived: false };
        const [projectStats, certDashboard, fleetDashboard, totalEmployees, totalVehicles, assignedVehicles, availableVehicles, openRFIs, openNCRs, pendingApprovals, outstandingPayments, projectHealth, costVsBudget, monthlyProgress, manpowerAllocation, vehicleUtilization, certificateExpiry,] = await Promise.all([
            projectService_1.projectService.getDashboardStats(),
            certificateService_1.certificateService.getDashboardStats(),
            vehicleService_1.vehicleService.getFleetDashboard(),
            models_1.User.countDocuments({ isActive: true }),
            models_1.Vehicle.countDocuments({ isDeleted: false }),
            models_1.Vehicle.countDocuments({ isDeleted: false, currentStatus: 'Assigned' }),
            models_1.Vehicle.countDocuments({ isDeleted: false, currentStatus: 'Available' }),
            models_1.ProjectIssue.countDocuments({ isDeleted: false, type: 'RFI', status: 'Open' }),
            models_1.ProjectIssue.countDocuments({ isDeleted: false, type: 'NCR', status: 'Open' }),
            models_1.Project.countDocuments({ ...baseProjectFilter, status: 'Under Review' }),
            models_1.ProjectFinancial.aggregate([
                { $group: { _id: null, total: { $sum: '$outstandingPayments' } } },
            ]),
            models_1.Project.aggregate([
                { $match: baseProjectFilter },
                {
                    $group: {
                        _id: '$delayStatus',
                        count: { $sum: 1 },
                        avgProgress: { $avg: '$progressPercent' },
                    },
                },
            ]),
            models_1.ProjectFinancial.aggregate([
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project',
                        foreignField: '_id',
                        as: 'projectInfo',
                    },
                },
                { $unwind: '$projectInfo' },
                { $match: { 'projectInfo.isDeleted': false } },
                {
                    $project: {
                        name: '$projectInfo.name',
                        code: '$projectInfo.code',
                        budget: 1,
                        actualCost: 1,
                        variance: { $subtract: ['$budget', '$actualCost'] },
                    },
                },
                { $limit: 10 },
            ]),
            models_1.Project.aggregate([
                { $match: baseProjectFilter },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m', date: '$updatedAt' } },
                        avgProgress: { $avg: '$progressPercent' },
                    },
                },
                { $sort: { _id: 1 } },
                { $limit: 12 },
            ]),
            models_1.ProjectAssignment.aggregate([
                { $match: { isDeleted: false, status: 'Active', resourceType: 'employee' } },
                { $group: { _id: '$employeeRole', count: { $sum: 1 } } },
            ]),
            models_1.Vehicle.aggregate([
                { $match: { isDeleted: false } },
                { $group: { _id: '$currentStatus', count: { $sum: 1 } } },
            ]),
            models_1.Certificate.aggregate([
                { $match: { isDeleted: false } },
                {
                    $bucket: {
                        groupBy: '$expiryDate',
                        boundaries: [new Date(0), now, in30Days, new Date('2099-12-31')],
                        default: 'Unknown',
                        output: { count: { $sum: 1 } },
                    },
                },
            ]),
        ]);
        return {
            projects: {
                total: projectStats.total,
                active: projectStats.active,
                completed: projectStats.completed,
                delayed: projectStats.delayed,
                proposal: projectStats.proposalStage,
                planning: projectStats.planningStage,
                pendingExecution: projectStats.pendingExecution,
                byStatus: projectStats.byStatus,
                overallProgress: projectStats.overallProgress,
            },
            employees: { total: totalEmployees },
            vehicles: {
                total: totalVehicles,
                assigned: assignedVehicles,
                available: availableVehicles,
                utilization: fleetDashboard.utilization,
            },
            certificates: {
                total: certDashboard.total,
                expiringSoon: certDashboard.expiringWithin30Days,
                expired: certDashboard.expired,
                byStatus: certDashboard.byStatus,
            },
            openRFIs,
            openNCRs,
            pendingApprovals,
            outstandingPayments: outstandingPayments[0]?.total || 0,
            charts: {
                projectStatusDistribution: projectStats.byStatus,
                monthlyProjectProgress: monthlyProgress.map((m) => ({
                    month: m._id,
                    progress: Math.round(m.avgProgress || 0),
                })),
                manpowerAllocation: manpowerAllocation.map((m) => ({
                    role: m._id || 'Unassigned',
                    count: m.count,
                })),
                vehicleUtilization: vehicleUtilization.map((v) => ({
                    status: v._id,
                    count: v.count,
                })),
                certificateExpiry: [
                    { label: 'Expired', count: certDashboard.expired },
                    { label: 'Expiring Soon', count: certDashboard.expiringWithin30Days },
                    { label: 'Active', count: certDashboard.active },
                ],
                projectHealth: projectHealth.map((h) => ({
                    status: h._id,
                    count: h.count,
                    avgProgress: Math.round(h.avgProgress || 0),
                })),
                costVsBudget: costVsBudget.map((c) => ({
                    name: c.name,
                    code: c.code,
                    budget: c.budget,
                    actualCost: c.actualCost,
                    variance: c.variance,
                })),
                resourceAllocation: projectStats.resourceAllocation,
            },
        };
    }
}
exports.ExecutiveDashboardService = ExecutiveDashboardService;
exports.executiveDashboardService = new ExecutiveDashboardService();
//# sourceMappingURL=executiveDashboardService.js.map