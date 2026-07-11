import { Types } from 'mongoose';
import { Vehicle, IVehicle } from '../models/Vehicle';
import { VehicleAssignment, IVehicleAssignment } from '../models/VehicleAssignment';
import { VehicleMaintenance, IVehicleMaintenance } from '../models/VehicleMaintenance';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiResponse';
import {
  PaginationOptions,
  PaginatedResult,
  buildPaginationMeta,
  buildSort,
  escapeRegex,
} from '../utils/pagination';
import {
  generateVehicleId,
  generateAssignmentId,
  calculateVehicleStatus,
} from '../utils/helpers';
import { storageService } from '../utils/storage';
import { notificationService } from './notificationService';
import { sendVehicleAlertEmail } from './emailService';
import { ASSIGNABLE_ROLES } from '../constants';

export interface VehicleFilters {
  search?: string;
  status?: string;
  fuelType?: string;
  assignedProject?: string;
  assignedEmployee?: string;
}

export interface CreateVehicleInput {
  vehicleName: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  insuranceNumber?: string;
  insuranceExpiryDate?: Date;
  mvpiExpiryDate?: Date;
  currentKm?: number;
  fuelType: IVehicle['fuelType'];
  assignedProject?: string;
  remarks?: string;
  createdBy: string;
}

export interface CreateAssignmentInput {
  vehicle: string;
  assignedTo: string;
  project?: string;
  assignmentDate?: Date;
  expectedReturnDate?: Date;
  startingKm: number;
  fuelLevel: IVehicleAssignment['fuelLevel'];
  notes?: string;
  assignedBy: string;
}

export interface ReturnVehicleInput {
  finalKm: number;
  fuelLevel: IVehicleAssignment['fuelLevel'];
  vehicleCondition: NonNullable<IVehicleAssignment['returnDetails']>['vehicleCondition'];
  remarks?: string;
  returnedBy: string;
}

export class VehicleService {
  private vehiclePopulate = [
    { path: 'assignedProject', select: 'name code' },
    { path: 'assignedEmployee', select: 'firstName lastName email' },
    { path: 'createdBy', select: 'firstName lastName' },
  ];

  private assignmentPopulate = [
    { path: 'vehicle', select: 'vehicleName registrationNumber vehicleId' },
    { path: 'assignedTo', select: 'firstName lastName email role' },
    { path: 'project', select: 'name code' },
    { path: 'assignedBy', select: 'firstName lastName' },
    { path: 'returnDetails.returnedBy', select: 'firstName lastName' },
  ];

  private buildVehicleFilter(filters: VehicleFilters): Record<string, unknown> {
    const query: Record<string, unknown> = { isDeleted: false };
    if (filters.search) {
      const regex = new RegExp(escapeRegex(filters.search), 'i');
      query.$or = [
        { vehicleName: regex },
        { registrationNumber: regex },
        { vehicleId: regex },
        { make: regex },
        { model: regex },
      ];
    }
    if (filters.status) query.currentStatus = filters.status;
    if (filters.fuelType) query.fuelType = filters.fuelType;
    if (filters.assignedProject) query.assignedProject = filters.assignedProject;
    if (filters.assignedEmployee) query.assignedEmployee = filters.assignedEmployee;
    return query;
  }

  // --- Vehicles CRUD ---

  async getVehicles(
    filters: VehicleFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<IVehicle>> {
    const query = this.buildVehicleFilter(filters);
    const [data, total] = await Promise.all([
      Vehicle.find(query)
        .populate(this.vehiclePopulate)
        .sort(buildSort(pagination.sortBy, pagination.sortOrder))
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit),
      Vehicle.countDocuments(query),
    ]);
    return { data, pagination: buildPaginationMeta(pagination.page, pagination.limit, total) };
  }

  async getVehicleById(id: string): Promise<IVehicle> {
    const vehicle = await Vehicle.findOne({ _id: id, isDeleted: false }).populate(
      this.vehiclePopulate,
    );
    if (!vehicle) throw new ApiError(404, 'Vehicle not found');
    return vehicle;
  }

  async createVehicle(input: CreateVehicleInput): Promise<IVehicle> {
    const existing = await Vehicle.findOne({
      registrationNumber: input.registrationNumber.toUpperCase(),
      isDeleted: false,
    });
    if (existing) throw new ApiError(400, 'Registration number already exists');

    const vehicle = await Vehicle.create({
      ...input,
      vehicleId: generateVehicleId(),
      registrationNumber: input.registrationNumber.toUpperCase(),
      currentStatus: calculateVehicleStatus({
        currentStatus: 'Available',
        insuranceExpiryDate: input.insuranceExpiryDate,
        mvpiExpiryDate: input.mvpiExpiryDate,
        isAssigned: false,
      }) as IVehicle['currentStatus'],
    });

    return vehicle.populate(this.vehiclePopulate);
  }

  async updateVehicle(
    id: string,
    input: Partial<CreateVehicleInput>,
    updatedBy: string,
  ): Promise<IVehicle> {
    const vehicle = await Vehicle.findOne({ _id: id, isDeleted: false });
    if (!vehicle) throw new ApiError(404, 'Vehicle not found');

    Object.assign(vehicle, input, { updatedBy });

    const activeAssignment = await VehicleAssignment.findOne({
      vehicle: id,
      status: 'Active',
      isDeleted: false,
    });

    vehicle.currentStatus = calculateVehicleStatus({
      currentStatus: vehicle.currentStatus,
      insuranceExpiryDate: vehicle.insuranceExpiryDate,
      mvpiExpiryDate: vehicle.mvpiExpiryDate,
      isAssigned: !!activeAssignment,
    }) as IVehicle['currentStatus'];

    await vehicle.save();
    return vehicle.populate(this.vehiclePopulate);
  }

  async deleteVehicle(id: string, deletedBy: string): Promise<void> {
    const vehicle = await Vehicle.findOne({ _id: id, isDeleted: false });
    if (!vehicle) throw new ApiError(404, 'Vehicle not found');

    const activeAssignment = await VehicleAssignment.findOne({
      vehicle: id,
      status: 'Active',
      isDeleted: false,
    });
    if (activeAssignment) {
      throw new ApiError(400, 'Cannot delete vehicle with active assignment');
    }

    vehicle.isDeleted = true;
    vehicle.deletedAt = new Date();
    vehicle.deletedBy = deletedBy as unknown as IVehicle['deletedBy'];
    await vehicle.save();
  }

  // --- Assignments ---

  async createAssignment(
    input: CreateAssignmentInput,
    photos: Record<string, Express.Multer.File[]>,
  ): Promise<IVehicleAssignment> {
    const vehicle = await Vehicle.findOne({ _id: input.vehicle, isDeleted: false });
    if (!vehicle) throw new ApiError(404, 'Vehicle not found');

    const activeAssignment = await VehicleAssignment.findOne({
      vehicle: input.vehicle,
      status: 'Active',
      isDeleted: false,
    });
    if (activeAssignment) {
      throw new ApiError(400, 'Vehicle already has an active assignment');
    }

    const assignee = await User.findById(input.assignedTo);
    if (!assignee || !ASSIGNABLE_ROLES.includes(assignee.role)) {
      throw new ApiError(400, 'Invalid assignee. Must be Engineer, Technician, or Driver');
    }

    const requiredPhotos = ['frontPhoto', 'rearPhoto', 'leftSidePhoto', 'rightSidePhoto', 'interiorPhoto'];
    for (const field of requiredPhotos) {
      if (!photos[field]?.[0]) {
        throw new ApiError(400, `Missing required photo: ${field}`);
      }
    }

    const preAssignmentPhotos = Object.entries(photos).flatMap(([type, files]) =>
      files.map((file) => ({
        ...storageService.storeFile(file, 'assignments'),
        type,
      })),
    );

    const assignment = await VehicleAssignment.create({
      assignmentId: generateAssignmentId(),
      ...input,
      preAssignmentPhotos,
      status: 'Active',
    });

    vehicle.assignedEmployee = input.assignedTo as unknown as Types.ObjectId;
    if (input.project) vehicle.assignedProject = input.project as unknown as Types.ObjectId;
    vehicle.currentKm = input.startingKm;
    vehicle.currentStatus = 'Assigned';
    await vehicle.save();

    return assignment.populate(this.assignmentPopulate);
  }

  async returnVehicle(
    assignmentId: string,
    input: ReturnVehicleInput,
    photos: Record<string, Express.Multer.File[]>,
  ): Promise<IVehicleAssignment> {
    const assignment = await VehicleAssignment.findOne({
      _id: assignmentId,
      status: 'Active',
      isDeleted: false,
    });
    if (!assignment) throw new ApiError(404, 'Active assignment not found');

    const returnPhotos = (photos.returnPhotos || []).map((file) => ({
      ...storageService.storeFile(file, 'assignments'),
      type: 'returnPhoto',
    }));

    const damagePhotos = (photos.damagePhotos || []).map((file) => ({
      ...storageService.storeFile(file, 'assignments'),
      type: 'damagePhoto',
    }));

    assignment.status = 'Returned';
    assignment.returnDetails = {
      returnDate: new Date(),
      finalKm: input.finalKm,
      fuelLevel: input.fuelLevel,
      vehicleCondition: input.vehicleCondition,
      returnPhotos,
      damagePhotos,
      remarks: input.remarks,
      returnedBy: input.returnedBy as unknown as Types.ObjectId,
    };
    await assignment.save();

    const vehicle = await Vehicle.findById(assignment.vehicle);
    if (vehicle) {
      vehicle.assignedEmployee = undefined;
      vehicle.assignedProject = undefined;
      vehicle.currentKm = input.finalKm;
      vehicle.currentStatus = calculateVehicleStatus({
        currentStatus: 'Available',
        insuranceExpiryDate: vehicle.insuranceExpiryDate,
        mvpiExpiryDate: vehicle.mvpiExpiryDate,
        isAssigned: false,
      }) as IVehicle['currentStatus'];
      await vehicle.save();
    }

    return assignment.populate(this.assignmentPopulate);
  }

  private async releaseVehicleFromAssignment(vehicleId: Types.ObjectId | string) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return;

    vehicle.assignedEmployee = undefined;
    vehicle.assignedProject = undefined;
    vehicle.currentStatus = calculateVehicleStatus({
      currentStatus: 'Available',
      insuranceExpiryDate: vehicle.insuranceExpiryDate,
      mvpiExpiryDate: vehicle.mvpiExpiryDate,
      isAssigned: false,
    }) as IVehicle['currentStatus'];
    await vehicle.save();
  }

  async updateAssignment(
    id: string,
    input: Partial<CreateAssignmentInput>,
  ): Promise<IVehicleAssignment> {
    const assignment = await VehicleAssignment.findOne({ _id: id, isDeleted: false });
    if (!assignment) throw new ApiError(404, 'Assignment not found');

    if (assignment.status === 'Returned') {
      if (input.notes !== undefined) assignment.notes = input.notes;
      await assignment.save();
      return assignment.populate(this.assignmentPopulate);
    }

    const oldVehicleId = assignment.vehicle.toString();

    if (input.assignedTo) {
      const assignee = await User.findById(input.assignedTo);
      if (!assignee || !ASSIGNABLE_ROLES.includes(assignee.role)) {
        throw new ApiError(400, 'Invalid assignee. Must be Engineer, Technician, or Driver');
      }
      assignment.assignedTo = input.assignedTo as unknown as Types.ObjectId;
    }

    if (input.startingKm !== undefined) assignment.startingKm = Number(input.startingKm);
    if (input.fuelLevel) assignment.fuelLevel = input.fuelLevel;
    if (input.notes !== undefined) assignment.notes = input.notes;
    if (input.expectedReturnDate !== undefined) {
      assignment.expectedReturnDate = input.expectedReturnDate
        ? new Date(input.expectedReturnDate)
        : undefined;
    }
    if (input.project !== undefined) {
      assignment.project = input.project
        ? (input.project as unknown as Types.ObjectId)
        : undefined;
    }
    if (input.assignmentDate) {
      assignment.assignmentDate = new Date(input.assignmentDate);
    }

    if (input.vehicle && input.vehicle !== oldVehicleId) {
      const newVehicle = await Vehicle.findOne({ _id: input.vehicle, isDeleted: false });
      if (!newVehicle) throw new ApiError(404, 'Vehicle not found');

      const conflict = await VehicleAssignment.findOne({
        vehicle: input.vehicle,
        status: 'Active',
        isDeleted: false,
        _id: { $ne: id },
      });
      if (conflict) {
        throw new ApiError(400, 'Vehicle already has an active assignment');
      }

      await this.releaseVehicleFromAssignment(oldVehicleId);
      assignment.vehicle = input.vehicle as unknown as Types.ObjectId;

      newVehicle.assignedEmployee = assignment.assignedTo;
      if (assignment.project) newVehicle.assignedProject = assignment.project;
      newVehicle.currentKm = assignment.startingKm;
      newVehicle.currentStatus = 'Assigned';
      await newVehicle.save();
    } else {
      const vehicle = await Vehicle.findById(assignment.vehicle);
      if (vehicle && (assignment.status === 'Active' || assignment.status === 'Overdue')) {
        vehicle.assignedEmployee = assignment.assignedTo;
        vehicle.assignedProject = assignment.project;
        if (input.startingKm !== undefined) vehicle.currentKm = assignment.startingKm;
        await vehicle.save();
      }
    }

    await assignment.save();
    return assignment.populate(this.assignmentPopulate);
  }

  async deleteAssignment(id: string): Promise<void> {
    const assignment = await VehicleAssignment.findOne({ _id: id, isDeleted: false });
    if (!assignment) throw new ApiError(404, 'Assignment not found');

    if (assignment.status === 'Active' || assignment.status === 'Overdue') {
      await this.releaseVehicleFromAssignment(assignment.vehicle);
    }

    assignment.isDeleted = true;
    await assignment.save();
  }

  async getAssignments(
    filters: { vehicle?: string; assignedTo?: string; status?: string; project?: string },
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<IVehicleAssignment>> {
    const query: Record<string, unknown> = { isDeleted: false };
    if (filters.vehicle) query.vehicle = filters.vehicle;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    if (filters.status) query.status = filters.status;
    if (filters.project) query.project = filters.project;

    const [data, total] = await Promise.all([
      VehicleAssignment.find(query)
        .populate(this.assignmentPopulate)
        .sort(buildSort(pagination.sortBy, pagination.sortOrder))
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit),
      VehicleAssignment.countDocuments(query),
    ]);

    return { data, pagination: buildPaginationMeta(pagination.page, pagination.limit, total) };
  }

  async getAssignmentById(id: string): Promise<IVehicleAssignment> {
    const assignment = await VehicleAssignment.findOne({ _id: id, isDeleted: false }).populate(
      this.assignmentPopulate,
    );
    if (!assignment) throw new ApiError(404, 'Assignment not found');
    return assignment;
  }

  // --- Maintenance ---

  async createMaintenance(
    input: Partial<IVehicleMaintenance> & { vehicle: string; createdBy: string },
  ): Promise<IVehicleMaintenance> {
    const vehicle = await Vehicle.findOne({ _id: input.vehicle, isDeleted: false });
    if (!vehicle) throw new ApiError(404, 'Vehicle not found');

    const maintenance = await VehicleMaintenance.create(input);

    if (input.maintenanceType === 'Insurance Renewal' && input.completedDate) {
      vehicle.insuranceExpiryDate = input.nextDueDate;
    }
    if (input.maintenanceType === 'MVPI Renewal' && input.completedDate) {
      vehicle.mvpiExpiryDate = input.nextDueDate;
    }

    if (['Repairs', 'Service Due', 'Oil Change', 'Tyres'].includes(input.maintenanceType || '')) {
      vehicle.currentStatus = 'Under Maintenance';
      await vehicle.save();
    }

    return maintenance.populate([
      { path: 'vehicle', select: 'vehicleName registrationNumber' },
      { path: 'createdBy', select: 'firstName lastName' },
    ]);
  }

  async getMaintenanceHistory(vehicleId: string, pagination: PaginationOptions) {
    const query = { vehicle: vehicleId, isDeleted: false };
    const [data, total] = await Promise.all([
      VehicleMaintenance.find(query)
        .populate('createdBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit),
      VehicleMaintenance.countDocuments(query),
    ]);
    return { data, pagination: buildPaginationMeta(pagination.page, pagination.limit, total) };
  }

  // --- Dashboard & Alerts ---

  async getFleetDashboard() {
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const baseFilter = { isDeleted: false };

    const [
      total,
      available,
      assigned,
      underMaintenance,
      insuranceExpiring,
      mvpiExpiring,
      statusBreakdown,
      kmSummary,
      activeAssignments,
    ] = await Promise.all([
      Vehicle.countDocuments(baseFilter),
      Vehicle.countDocuments({ ...baseFilter, currentStatus: 'Available' }),
      Vehicle.countDocuments({ ...baseFilter, currentStatus: 'Assigned' }),
      Vehicle.countDocuments({ ...baseFilter, currentStatus: 'Under Maintenance' }),
      Vehicle.countDocuments({
        ...baseFilter,
        insuranceExpiryDate: { $gte: now, $lte: in30Days },
      }),
      Vehicle.countDocuments({
        ...baseFilter,
        mvpiExpiryDate: { $gte: now, $lte: in30Days },
      }),
      Vehicle.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$currentStatus', count: { $sum: 1 } } },
      ]),
      Vehicle.aggregate([
        { $match: baseFilter },
        {
          $group: {
            _id: null,
            totalKm: { $sum: '$currentKm' },
            avgKm: { $avg: '$currentKm' },
            maxKm: { $max: '$currentKm' },
          },
        },
      ]),
      VehicleAssignment.find({ status: 'Active', isDeleted: false })
        .populate('vehicle assignedTo', 'vehicleName registrationNumber firstName lastName')
        .limit(10),
    ]);

    const utilization =
      total > 0 ? Math.round(((assigned / total) * 100 + Number.EPSILON) * 100) / 100 : 0;

    return {
      total,
      available,
      assigned,
      underMaintenance,
      insuranceExpiringSoon: insuranceExpiring,
      mvpiExpiringSoon: mvpiExpiring,
      utilization,
      statusBreakdown: statusBreakdown.map((s) => ({ status: s._id, count: s.count })),
      kmUsageSummary: kmSummary[0] || { totalKm: 0, avgKm: 0, maxKm: 0 },
      activeAssignments,
    };
  }

  async processVehicleAlerts(): Promise<number> {
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    let alertsSent = 0;

    const admins = await User.find({
      role: { $in: ['super_admin', 'admin', 'manager'] },
      isActive: true,
    });

    // Insurance expiry alerts
    const insuranceExpiring = await Vehicle.find({
      isDeleted: false,
      insuranceExpiryDate: { $gte: now, $lte: in30Days },
    });

    for (const vehicle of insuranceExpiring) {
      for (const admin of admins) {
        await notificationService.create({
          user: admin._id,
          title: 'Insurance Expiring Soon',
          message: `Vehicle ${vehicle.vehicleName} (${vehicle.registrationNumber}) insurance expires on ${vehicle.insuranceExpiryDate?.toLocaleDateString()}`,
          type: 'vehicle_insurance',
          relatedEntity: { entityType: 'Vehicle', entityId: vehicle._id },
        });
        await sendVehicleAlertEmail(
          admin.email,
          vehicle.vehicleName,
          'Insurance Expiry',
          vehicle.insuranceExpiryDate,
        );
        alertsSent++;
      }
    }

    // MVPI expiry alerts
    const mvpiExpiring = await Vehicle.find({
      isDeleted: false,
      mvpiExpiryDate: { $gte: now, $lte: in30Days },
    });

    for (const vehicle of mvpiExpiring) {
      for (const admin of admins) {
        await notificationService.create({
          user: admin._id,
          title: 'MVPI Expiring Soon',
          message: `Vehicle ${vehicle.vehicleName} (${vehicle.registrationNumber}) MVPI expires on ${vehicle.mvpiExpiryDate?.toLocaleDateString()}`,
          type: 'vehicle_mvpi',
          relatedEntity: { entityType: 'Vehicle', entityId: vehicle._id },
        });
        alertsSent++;
      }
    }

    // Overdue returns
    const overdueAssignments = await VehicleAssignment.find({
      status: 'Active',
      expectedReturnDate: { $lt: now },
      isDeleted: false,
    }).populate('vehicle assignedTo');

    for (const assignment of overdueAssignments) {
      assignment.status = 'Overdue';
      await assignment.save();

      for (const admin of admins) {
        await notificationService.create({
          user: admin._id,
          title: 'Overdue Vehicle Return',
          message: `Assignment ${assignment.assignmentId} is overdue. Expected return: ${assignment.expectedReturnDate?.toLocaleDateString()}`,
          type: 'vehicle_return',
          relatedEntity: { entityType: 'VehicleAssignment', entityId: assignment._id },
        });
        alertsSent++;
      }
    }

    // Service due alerts
    const serviceDue = await VehicleMaintenance.find({
      isDeleted: false,
      nextDueDate: { $gte: now, $lte: in30Days },
      maintenanceType: { $in: ['Service Due', 'Oil Change'] },
    }).populate('vehicle');

    for (const maintenance of serviceDue) {
      for (const admin of admins) {
        await notificationService.create({
          user: admin._id,
          title: 'Vehicle Service Due',
          message: `${maintenance.maintenanceType} for vehicle is due on ${maintenance.nextDueDate?.toLocaleDateString()}`,
          type: 'vehicle_service',
          relatedEntity: {
            entityType: 'VehicleMaintenance',
            entityId: maintenance._id,
          },
        });
        alertsSent++;
      }
    }

    return alertsSent;
  }

  async getExportData(filters: VehicleFilters) {
    return Vehicle.find(this.buildVehicleFilter(filters))
      .populate(this.vehiclePopulate)
      .sort({ vehicleName: 1 });
  }
}

export const vehicleService = new VehicleService();
