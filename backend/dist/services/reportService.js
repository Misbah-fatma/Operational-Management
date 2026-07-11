"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = exports.ReportService = void 0;
const models_1 = require("../models");
const pagination_1 = require("../utils/pagination");
const userName = (u) => {
    const user = u;
    return user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '';
};
class ReportService {
    dateFilter(field, dateFrom, dateTo) {
        if (!dateFrom && !dateTo)
            return {};
        const filter = {};
        if (dateFrom)
            filter.$gte = new Date(dateFrom);
        if (dateTo)
            filter.$lte = new Date(dateTo);
        return { [field]: filter };
    }
    async generateReport(filters) {
        switch (filters.reportType) {
            case 'project':
                return this.projectReport(filters);
            case 'certificate':
                return this.certificateReport(filters);
            case 'vehicle_assignment':
                return this.vehicleAssignmentReport(filters);
            case 'vehicle_inspection':
                return this.vehicleInspectionReport(filters);
            case 'vehicle_maintenance':
                return this.vehicleMaintenanceReport(filters);
            case 'manpower_allocation':
                return this.manpowerAllocationReport(filters);
            case 'resource_allocation':
                return this.resourceAllocationReport(filters);
            case 'financial_summary':
                return this.financialSummaryReport(filters);
            default:
                return { columns: [], rows: [], title: 'Report' };
        }
    }
    async projectReport(filters) {
        const query = { isDeleted: false };
        if (filters.status)
            query.status = filters.status;
        if (filters.client)
            query.client = new RegExp((0, pagination_1.escapeRegex)(filters.client), 'i');
        if (filters.project)
            query._id = filters.project;
        if (filters.search) {
            const regex = new RegExp((0, pagination_1.escapeRegex)(filters.search), 'i');
            query.$or = [{ name: regex }, { code: regex }, { client: regex }];
        }
        Object.assign(query, this.dateFilter('startDate', filters.dateFrom, filters.dateTo));
        const data = await models_1.Project.find(query)
            .populate('projectManager', 'firstName lastName')
            .sort({ createdAt: -1 });
        return {
            title: 'Project Report',
            columns: [
                'Project ID',
                'Name',
                'Client',
                'Contract Number',
                'Location',
                'Start Date',
                'End Date',
                'Budget',
                'Status',
                'Progress %',
                'Manager',
            ],
            rows: data.map((p) => [
                p.code,
                p.name,
                p.client || '',
                p.contractNumber || '',
                p.location || '',
                p.startDate ? p.startDate.toLocaleDateString() : '',
                p.endDate ? p.endDate.toLocaleDateString() : '',
                String(p.budget || 0),
                p.status,
                String(p.progressPercent),
                p.projectManager ? userName(p.projectManager) : '',
            ]),
            data,
        };
    }
    async certificateReport(filters) {
        const query = { isDeleted: false };
        if (filters.category)
            query.category = filters.category;
        if (filters.status)
            query.status = filters.status;
        Object.assign(query, this.dateFilter('expiryDate', filters.dateFrom, filters.dateTo));
        const data = await models_1.Certificate.find(query)
            .populate('relatedEmployee', 'firstName lastName')
            .populate('relatedProject', 'name code')
            .sort({ expiryDate: 1 });
        return {
            title: 'Certificate Report',
            columns: ['ID', 'Name', 'Category', 'Issue Date', 'Expiry Date', 'Status', 'Authority'],
            rows: data.map((c) => [
                c.certificateId,
                c.certificateName,
                c.category,
                c.issueDate.toLocaleDateString(),
                c.expiryDate.toLocaleDateString(),
                c.status,
                c.issuingAuthority,
            ]),
            data,
        };
    }
    async vehicleAssignmentReport(filters) {
        const query = {};
        if (filters.vehicle)
            query.vehicle = filters.vehicle;
        if (filters.project)
            query.project = filters.project;
        if (filters.employee)
            query.assignedTo = filters.employee;
        if (filters.status)
            query.status = filters.status;
        Object.assign(query, this.dateFilter('assignmentDate', filters.dateFrom, filters.dateTo));
        const data = await models_1.VehicleAssignment.find(query)
            .populate('vehicle', 'vehicleName registrationNumber')
            .populate('assignedTo', 'firstName lastName')
            .populate('project', 'name code')
            .sort({ assignmentDate: -1 });
        return {
            title: 'Vehicle Assignment Report',
            columns: ['Assignment ID', 'Vehicle', 'Assigned To', 'Project', 'Date', 'Status', 'Return Date'],
            rows: data.map((a) => [
                a.assignmentId,
                a.vehicle?.vehicleName || '',
                userName(a.assignedTo),
                a.project?.name || '',
                a.assignmentDate.toLocaleDateString(),
                a.status,
                a.returnDetails?.returnDate ? a.returnDetails.returnDate.toLocaleDateString() : '',
            ]),
            data,
        };
    }
    async vehicleInspectionReport(filters) {
        const query = { isDeleted: false };
        if (filters.vehicle)
            query._id = filters.vehicle;
        if (filters.status)
            query.currentStatus = filters.status;
        const data = await models_1.Vehicle.find(query).sort({ vehicleName: 1 });
        return {
            title: 'Vehicle Inspection Report',
            columns: ['Vehicle ID', 'Name', 'Registration', 'Status', 'Insurance Expiry', 'MVPI Expiry', 'KM'],
            rows: data.map((v) => [
                v.vehicleId,
                v.vehicleName,
                v.registrationNumber,
                v.currentStatus,
                v.insuranceExpiryDate ? v.insuranceExpiryDate.toLocaleDateString() : '',
                v.mvpiExpiryDate ? v.mvpiExpiryDate.toLocaleDateString() : '',
                String(v.currentKm),
            ]),
            data,
        };
    }
    async vehicleMaintenanceReport(filters) {
        const query = {};
        if (filters.vehicle)
            query.vehicle = filters.vehicle;
        Object.assign(query, this.dateFilter('scheduledDate', filters.dateFrom, filters.dateTo));
        const data = await models_1.VehicleMaintenance.find(query)
            .populate('vehicle', 'vehicleName registrationNumber')
            .sort({ scheduledDate: -1 });
        return {
            title: 'Vehicle Maintenance Report',
            columns: ['Vehicle', 'Type', 'Description', 'Cost', 'Scheduled', 'Completed', 'Next Due'],
            rows: data.map((m) => [
                m.vehicle?.vehicleName || '',
                m.maintenanceType,
                m.description,
                String(m.cost || 0),
                m.scheduledDate ? m.scheduledDate.toLocaleDateString() : '',
                m.completedDate ? m.completedDate.toLocaleDateString() : '',
                m.nextDueDate ? m.nextDueDate.toLocaleDateString() : '',
            ]),
            data,
        };
    }
    async manpowerAllocationReport(filters) {
        const query = {
            isDeleted: false,
            resourceType: 'employee',
        };
        if (filters.project)
            query.project = filters.project;
        if (filters.employee)
            query.employee = filters.employee;
        if (filters.status)
            query.status = filters.status;
        Object.assign(query, this.dateFilter('assignmentDate', filters.dateFrom, filters.dateTo));
        const data = await models_1.ProjectAssignment.find(query)
            .populate('employee', 'firstName lastName role')
            .populate('project', 'name code')
            .sort({ assignmentDate: -1 });
        return {
            title: 'Manpower Allocation Report',
            columns: ['Assignment ID', 'Employee', 'Role', 'Project', 'Work Package', 'Assigned', 'Released', 'Status'],
            rows: data.map((a) => [
                a.assignmentId,
                userName(a.employee),
                a.employeeRole || '',
                a.project?.name || '',
                a.workPackage || '',
                a.assignmentDate.toLocaleDateString(),
                a.releaseDate ? a.releaseDate.toLocaleDateString() : '',
                a.status,
            ]),
            data,
        };
    }
    async resourceAllocationReport(filters) {
        const query = { isDeleted: false };
        if (filters.project)
            query.project = filters.project;
        if (filters.status)
            query.status = filters.status;
        Object.assign(query, this.dateFilter('assignmentDate', filters.dateFrom, filters.dateTo));
        const data = await models_1.ProjectAssignment.find(query)
            .populate('employee', 'firstName lastName')
            .populate('vehicle', 'vehicleName registrationNumber')
            .populate('equipment', 'name equipmentId')
            .populate('project', 'name code')
            .sort({ assignmentDate: -1 });
        return {
            title: 'Resource Allocation Report',
            columns: ['Assignment ID', 'Type', 'Resource', 'Project', 'Work Package', 'Assigned', 'Status'],
            rows: data.map((a) => {
                let resource = '';
                if (a.resourceType === 'employee' && a.employee) {
                    resource = userName(a.employee);
                }
                else if (a.resourceType === 'vehicle' && a.vehicle) {
                    resource = a.vehicle.vehicleName || '';
                }
                else if (a.resourceType === 'equipment' && a.equipment) {
                    resource = a.equipment.name || '';
                }
                return [
                    a.assignmentId,
                    a.resourceType,
                    resource,
                    a.project?.name || '',
                    a.workPackage || '',
                    a.assignmentDate.toLocaleDateString(),
                    a.status,
                ];
            }),
            data,
        };
    }
    async financialSummaryReport(filters) {
        const match = {};
        if (filters.project)
            match.project = filters.project;
        const data = await models_1.ProjectFinancial.find(match)
            .populate({ path: 'project', select: 'name code client status budget actualCost' })
            .sort({ updatedAt: -1 });
        return {
            title: 'Financial Summary Report',
            columns: ['Project', 'Client', 'Budget', 'Actual Cost', 'Used %', 'Outstanding', 'Variance'],
            rows: data.map((f) => {
                const project = f.project;
                const budget = f.budget || 0;
                const actual = f.actualCost || 0;
                const usedPct = budget > 0 ? Math.round((actual / budget) * 100) : 0;
                return [
                    project?.name || '',
                    project?.client || '',
                    String(budget),
                    String(actual),
                    `${usedPct}%`,
                    String(f.outstandingPayments || 0),
                    String(budget - actual),
                ];
            }),
            data,
        };
    }
}
exports.ReportService = ReportService;
exports.reportService = new ReportService();
//# sourceMappingURL=reportService.js.map