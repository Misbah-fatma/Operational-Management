import {
  Project,
  Certificate,
  Vehicle,
  VehicleAssignment,
  VehicleMaintenance,
  ProjectAssignment,
  ProjectFinancial,
  User,
} from '../models';
import { escapeRegex } from '../utils/pagination';
import { REPORT_TYPES } from '../constants';

type PopulatedUser = { firstName?: string; lastName?: string };
type PopulatedVehicle = { vehicleName?: string };
type PopulatedEquipment = { name?: string };
type PopulatedProject = { name?: string; code?: string; client?: string };

const userName = (u: unknown) => {
  const user = u as PopulatedUser;
  return user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '';
};

export interface ReportFilters {
  reportType: (typeof REPORT_TYPES)[number];
  dateFrom?: string;
  dateTo?: string;
  project?: string;
  employee?: string;
  vehicle?: string;
  category?: string;
  status?: string;
  client?: string;
  search?: string;
}

export class ReportService {
  private dateFilter(field: string, dateFrom?: string, dateTo?: string) {
    if (!dateFrom && !dateTo) return {};
    const filter: Record<string, Date> = {};
    if (dateFrom) filter.$gte = new Date(dateFrom);
    if (dateTo) filter.$lte = new Date(dateTo);
    return { [field]: filter };
  }

  async generateReport(filters: ReportFilters) {
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

  private async projectReport(filters: ReportFilters) {
    const query: Record<string, unknown> = { isDeleted: false };
    if (filters.status) query.status = filters.status;
    if (filters.client) query.client = new RegExp(escapeRegex(filters.client), 'i');
    if (filters.project) query._id = filters.project;
    if (filters.search) {
      const regex = new RegExp(escapeRegex(filters.search), 'i');
      query.$or = [{ name: regex }, { code: regex }, { client: regex }];
    }
    Object.assign(query, this.dateFilter('startDate', filters.dateFrom, filters.dateTo));

    const data = await Project.find(query)
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

  private async certificateReport(filters: ReportFilters) {
    const query: Record<string, unknown> = { isDeleted: false };
    if (filters.category) query.category = filters.category;
    if (filters.status) query.status = filters.status;
    Object.assign(query, this.dateFilter('expiryDate', filters.dateFrom, filters.dateTo));

    const data = await Certificate.find(query)
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

  private async vehicleAssignmentReport(filters: ReportFilters) {
    const query: Record<string, unknown> = {};
    if (filters.vehicle) query.vehicle = filters.vehicle;
    if (filters.project) query.project = filters.project;
    if (filters.employee) query.assignedTo = filters.employee;
    if (filters.status) query.status = filters.status;
    Object.assign(query, this.dateFilter('assignmentDate', filters.dateFrom, filters.dateTo));

    const data = await VehicleAssignment.find(query)
      .populate('vehicle', 'vehicleName registrationNumber')
      .populate('assignedTo', 'firstName lastName')
      .populate('project', 'name code')
      .sort({ assignmentDate: -1 });

    return {
      title: 'Vehicle Assignment Report',
      columns: ['Assignment ID', 'Vehicle', 'Assigned To', 'Project', 'Date', 'Status', 'Return Date'],
      rows: data.map((a) => [
        a.assignmentId,
        (a.vehicle as PopulatedVehicle)?.vehicleName || '',
        userName(a.assignedTo),
        (a.project as PopulatedProject)?.name || '',
        a.assignmentDate.toLocaleDateString(),
        a.status,
        a.returnDetails?.returnDate ? a.returnDetails.returnDate.toLocaleDateString() : '',
      ]),
      data,
    };
  }

  private async vehicleInspectionReport(filters: ReportFilters) {
    const query: Record<string, unknown> = { isDeleted: false };
    if (filters.vehicle) query._id = filters.vehicle;
    if (filters.status) query.currentStatus = filters.status;

    const data = await Vehicle.find(query).sort({ vehicleName: 1 });

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

  private async vehicleMaintenanceReport(filters: ReportFilters) {
    const query: Record<string, unknown> = {};
    if (filters.vehicle) query.vehicle = filters.vehicle;
    Object.assign(query, this.dateFilter('scheduledDate', filters.dateFrom, filters.dateTo));

    const data = await VehicleMaintenance.find(query)
      .populate('vehicle', 'vehicleName registrationNumber')
      .sort({ scheduledDate: -1 });

    return {
      title: 'Vehicle Maintenance Report',
      columns: ['Vehicle', 'Type', 'Description', 'Cost', 'Scheduled', 'Completed', 'Next Due'],
      rows: data.map((m) => [
        (m.vehicle as { vehicleName?: string })?.vehicleName || '',
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

  private async manpowerAllocationReport(filters: ReportFilters) {
    const query: Record<string, unknown> = {
      isDeleted: false,
      resourceType: 'employee',
    };
    if (filters.project) query.project = filters.project;
    if (filters.employee) query.employee = filters.employee;
    if (filters.status) query.status = filters.status;
    Object.assign(query, this.dateFilter('assignmentDate', filters.dateFrom, filters.dateTo));

    const data = await ProjectAssignment.find(query)
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
        (a.project as PopulatedProject)?.name || '',
        a.workPackage || '',
        a.assignmentDate.toLocaleDateString(),
        a.releaseDate ? a.releaseDate.toLocaleDateString() : '',
        a.status,
      ]),
      data,
    };
  }

  private async resourceAllocationReport(filters: ReportFilters) {
    const query: Record<string, unknown> = { isDeleted: false };
    if (filters.project) query.project = filters.project;
    if (filters.status) query.status = filters.status;
    Object.assign(query, this.dateFilter('assignmentDate', filters.dateFrom, filters.dateTo));

    const data = await ProjectAssignment.find(query)
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
        } else if (a.resourceType === 'vehicle' && a.vehicle) {
          resource = (a.vehicle as PopulatedVehicle).vehicleName || '';
        } else if (a.resourceType === 'equipment' && a.equipment) {
          resource = (a.equipment as PopulatedEquipment).name || '';
        }
        return [
          a.assignmentId,
          a.resourceType,
          resource,
          (a.project as PopulatedProject)?.name || '',
          a.workPackage || '',
          a.assignmentDate.toLocaleDateString(),
          a.status,
        ];
      }),
      data,
    };
  }

  private async financialSummaryReport(filters: ReportFilters) {
    const match: Record<string, unknown> = {};
    if (filters.project) match.project = filters.project;

    const data = await ProjectFinancial.find(match)
      .populate({ path: 'project', select: 'name code client status budget actualCost' })
      .sort({ updatedAt: -1 });

    return {
      title: 'Financial Summary Report',
      columns: ['Project', 'Client', 'Budget', 'Actual Cost', 'Used %', 'Outstanding', 'Variance'],
      rows: data.map((f) => {
        const project = f.project as PopulatedProject & { budget?: number; actualCost?: number };
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

export const reportService = new ReportService();
