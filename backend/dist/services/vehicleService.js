"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleService = exports.VehicleService = void 0;
const Vehicle_1 = require("../models/Vehicle");
const VehicleAssignment_1 = require("../models/VehicleAssignment");
const VehicleMaintenance_1 = require("../models/VehicleMaintenance");
const User_1 = require("../models/User");
const ApiResponse_1 = require("../utils/ApiResponse");
const pagination_1 = require("../utils/pagination");
const helpers_1 = require("../utils/helpers");
const storage_1 = require("../utils/storage");
const notificationService_1 = require("./notificationService");
const emailService_1 = require("./emailService");
const constants_1 = require("../constants");
class VehicleService {
    constructor() {
        this.vehiclePopulate = [
            { path: 'assignedProject', select: 'name code' },
            { path: 'assignedEmployee', select: 'firstName lastName email' },
            { path: 'createdBy', select: 'firstName lastName' },
        ];
        this.assignmentPopulate = [
            { path: 'vehicle', select: 'vehicleName registrationNumber vehicleId' },
            { path: 'assignedTo', select: 'firstName lastName email role' },
            { path: 'project', select: 'name code' },
            { path: 'assignedBy', select: 'firstName lastName' },
            { path: 'returnDetails.returnedBy', select: 'firstName lastName' },
        ];
    }
    buildVehicleFilter(filters) {
        const query = { isDeleted: false };
        if (filters.search) {
            const regex = new RegExp((0, pagination_1.escapeRegex)(filters.search), 'i');
            query.$or = [
                { vehicleName: regex },
                { registrationNumber: regex },
                { vehicleId: regex },
                { make: regex },
                { model: regex },
            ];
        }
        if (filters.status)
            query.currentStatus = filters.status;
        if (filters.fuelType)
            query.fuelType = filters.fuelType;
        if (filters.assignedProject)
            query.assignedProject = filters.assignedProject;
        if (filters.assignedEmployee)
            query.assignedEmployee = filters.assignedEmployee;
        return query;
    }
    // --- Vehicles CRUD ---
    async getVehicles(filters, pagination) {
        const query = this.buildVehicleFilter(filters);
        const [data, total] = await Promise.all([
            Vehicle_1.Vehicle.find(query)
                .populate(this.vehiclePopulate)
                .sort((0, pagination_1.buildSort)(pagination.sortBy, pagination.sortOrder))
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit),
            Vehicle_1.Vehicle.countDocuments(query),
        ]);
        return { data, pagination: (0, pagination_1.buildPaginationMeta)(pagination.page, pagination.limit, total) };
    }
    async getVehicleById(id) {
        const vehicle = await Vehicle_1.Vehicle.findOne({ _id: id, isDeleted: false }).populate(this.vehiclePopulate);
        if (!vehicle)
            throw new ApiResponse_1.ApiError(404, 'Vehicle not found');
        return vehicle;
    }
    async createVehicle(input) {
        const existing = await Vehicle_1.Vehicle.findOne({
            registrationNumber: input.registrationNumber.toUpperCase(),
            isDeleted: false,
        });
        if (existing)
            throw new ApiResponse_1.ApiError(400, 'Registration number already exists');
        const vehicle = await Vehicle_1.Vehicle.create({
            ...input,
            vehicleId: (0, helpers_1.generateVehicleId)(),
            registrationNumber: input.registrationNumber.toUpperCase(),
            currentStatus: (0, helpers_1.calculateVehicleStatus)({
                currentStatus: 'Available',
                insuranceExpiryDate: input.insuranceExpiryDate,
                mvpiExpiryDate: input.mvpiExpiryDate,
                isAssigned: false,
            }),
        });
        return vehicle.populate(this.vehiclePopulate);
    }
    async updateVehicle(id, input, updatedBy) {
        const vehicle = await Vehicle_1.Vehicle.findOne({ _id: id, isDeleted: false });
        if (!vehicle)
            throw new ApiResponse_1.ApiError(404, 'Vehicle not found');
        Object.assign(vehicle, input, { updatedBy });
        const activeAssignment = await VehicleAssignment_1.VehicleAssignment.findOne({
            vehicle: id,
            status: 'Active',
            isDeleted: false,
        });
        vehicle.currentStatus = (0, helpers_1.calculateVehicleStatus)({
            currentStatus: vehicle.currentStatus,
            insuranceExpiryDate: vehicle.insuranceExpiryDate,
            mvpiExpiryDate: vehicle.mvpiExpiryDate,
            isAssigned: !!activeAssignment,
        });
        await vehicle.save();
        return vehicle.populate(this.vehiclePopulate);
    }
    async deleteVehicle(id, deletedBy) {
        const vehicle = await Vehicle_1.Vehicle.findOne({ _id: id, isDeleted: false });
        if (!vehicle)
            throw new ApiResponse_1.ApiError(404, 'Vehicle not found');
        const activeAssignment = await VehicleAssignment_1.VehicleAssignment.findOne({
            vehicle: id,
            status: 'Active',
            isDeleted: false,
        });
        if (activeAssignment) {
            throw new ApiResponse_1.ApiError(400, 'Cannot delete vehicle with active assignment');
        }
        vehicle.isDeleted = true;
        vehicle.deletedAt = new Date();
        vehicle.deletedBy = deletedBy;
        await vehicle.save();
    }
    // --- Assignments ---
    async createAssignment(input, photos) {
        const vehicle = await Vehicle_1.Vehicle.findOne({ _id: input.vehicle, isDeleted: false });
        if (!vehicle)
            throw new ApiResponse_1.ApiError(404, 'Vehicle not found');
        const activeAssignment = await VehicleAssignment_1.VehicleAssignment.findOne({
            vehicle: input.vehicle,
            status: 'Active',
            isDeleted: false,
        });
        if (activeAssignment) {
            throw new ApiResponse_1.ApiError(400, 'Vehicle already has an active assignment');
        }
        const assignee = await User_1.User.findById(input.assignedTo);
        if (!assignee || !constants_1.ASSIGNABLE_ROLES.includes(assignee.role)) {
            throw new ApiResponse_1.ApiError(400, 'Invalid assignee. Must be Engineer, Technician, or Driver');
        }
        const requiredPhotos = ['frontPhoto', 'rearPhoto', 'leftSidePhoto', 'rightSidePhoto', 'interiorPhoto'];
        for (const field of requiredPhotos) {
            if (!photos[field]?.[0]) {
                throw new ApiResponse_1.ApiError(400, `Missing required photo: ${field}`);
            }
        }
        const preAssignmentPhotos = Object.entries(photos).flatMap(([type, files]) => files.map((file) => ({
            ...storage_1.storageService.storeFile(file, 'assignments'),
            type,
        })));
        const assignment = await VehicleAssignment_1.VehicleAssignment.create({
            assignmentId: (0, helpers_1.generateAssignmentId)(),
            ...input,
            preAssignmentPhotos,
            status: 'Active',
        });
        vehicle.assignedEmployee = input.assignedTo;
        if (input.project)
            vehicle.assignedProject = input.project;
        vehicle.currentKm = input.startingKm;
        vehicle.currentStatus = 'Assigned';
        await vehicle.save();
        return assignment.populate(this.assignmentPopulate);
    }
    async returnVehicle(assignmentId, input, photos) {
        const assignment = await VehicleAssignment_1.VehicleAssignment.findOne({
            _id: assignmentId,
            status: 'Active',
            isDeleted: false,
        });
        if (!assignment)
            throw new ApiResponse_1.ApiError(404, 'Active assignment not found');
        const returnPhotos = (photos.returnPhotos || []).map((file) => ({
            ...storage_1.storageService.storeFile(file, 'assignments'),
            type: 'returnPhoto',
        }));
        const damagePhotos = (photos.damagePhotos || []).map((file) => ({
            ...storage_1.storageService.storeFile(file, 'assignments'),
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
            returnedBy: input.returnedBy,
        };
        await assignment.save();
        const vehicle = await Vehicle_1.Vehicle.findById(assignment.vehicle);
        if (vehicle) {
            vehicle.assignedEmployee = undefined;
            vehicle.assignedProject = undefined;
            vehicle.currentKm = input.finalKm;
            vehicle.currentStatus = (0, helpers_1.calculateVehicleStatus)({
                currentStatus: 'Available',
                insuranceExpiryDate: vehicle.insuranceExpiryDate,
                mvpiExpiryDate: vehicle.mvpiExpiryDate,
                isAssigned: false,
            });
            await vehicle.save();
        }
        return assignment.populate(this.assignmentPopulate);
    }
    async getAssignments(filters, pagination) {
        const query = { isDeleted: false };
        if (filters.vehicle)
            query.vehicle = filters.vehicle;
        if (filters.assignedTo)
            query.assignedTo = filters.assignedTo;
        if (filters.status)
            query.status = filters.status;
        if (filters.project)
            query.project = filters.project;
        const [data, total] = await Promise.all([
            VehicleAssignment_1.VehicleAssignment.find(query)
                .populate(this.assignmentPopulate)
                .sort((0, pagination_1.buildSort)(pagination.sortBy, pagination.sortOrder))
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit),
            VehicleAssignment_1.VehicleAssignment.countDocuments(query),
        ]);
        return { data, pagination: (0, pagination_1.buildPaginationMeta)(pagination.page, pagination.limit, total) };
    }
    async getAssignmentById(id) {
        const assignment = await VehicleAssignment_1.VehicleAssignment.findOne({ _id: id, isDeleted: false }).populate(this.assignmentPopulate);
        if (!assignment)
            throw new ApiResponse_1.ApiError(404, 'Assignment not found');
        return assignment;
    }
    // --- Maintenance ---
    async createMaintenance(input) {
        const vehicle = await Vehicle_1.Vehicle.findOne({ _id: input.vehicle, isDeleted: false });
        if (!vehicle)
            throw new ApiResponse_1.ApiError(404, 'Vehicle not found');
        const maintenance = await VehicleMaintenance_1.VehicleMaintenance.create(input);
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
    async getMaintenanceHistory(vehicleId, pagination) {
        const query = { vehicle: vehicleId, isDeleted: false };
        const [data, total] = await Promise.all([
            VehicleMaintenance_1.VehicleMaintenance.find(query)
                .populate('createdBy', 'firstName lastName')
                .sort({ createdAt: -1 })
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit),
            VehicleMaintenance_1.VehicleMaintenance.countDocuments(query),
        ]);
        return { data, pagination: (0, pagination_1.buildPaginationMeta)(pagination.page, pagination.limit, total) };
    }
    // --- Dashboard & Alerts ---
    async getFleetDashboard() {
        const now = new Date();
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const baseFilter = { isDeleted: false };
        const [total, available, assigned, underMaintenance, insuranceExpiring, mvpiExpiring, statusBreakdown, kmSummary, activeAssignments,] = await Promise.all([
            Vehicle_1.Vehicle.countDocuments(baseFilter),
            Vehicle_1.Vehicle.countDocuments({ ...baseFilter, currentStatus: 'Available' }),
            Vehicle_1.Vehicle.countDocuments({ ...baseFilter, currentStatus: 'Assigned' }),
            Vehicle_1.Vehicle.countDocuments({ ...baseFilter, currentStatus: 'Under Maintenance' }),
            Vehicle_1.Vehicle.countDocuments({
                ...baseFilter,
                insuranceExpiryDate: { $gte: now, $lte: in30Days },
            }),
            Vehicle_1.Vehicle.countDocuments({
                ...baseFilter,
                mvpiExpiryDate: { $gte: now, $lte: in30Days },
            }),
            Vehicle_1.Vehicle.aggregate([
                { $match: baseFilter },
                { $group: { _id: '$currentStatus', count: { $sum: 1 } } },
            ]),
            Vehicle_1.Vehicle.aggregate([
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
            VehicleAssignment_1.VehicleAssignment.find({ status: 'Active', isDeleted: false })
                .populate('vehicle assignedTo', 'vehicleName registrationNumber firstName lastName')
                .limit(10),
        ]);
        const utilization = total > 0 ? Math.round(((assigned / total) * 100 + Number.EPSILON) * 100) / 100 : 0;
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
    async processVehicleAlerts() {
        const now = new Date();
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        let alertsSent = 0;
        const admins = await User_1.User.find({
            role: { $in: ['super_admin', 'admin', 'manager'] },
            isActive: true,
        });
        // Insurance expiry alerts
        const insuranceExpiring = await Vehicle_1.Vehicle.find({
            isDeleted: false,
            insuranceExpiryDate: { $gte: now, $lte: in30Days },
        });
        for (const vehicle of insuranceExpiring) {
            for (const admin of admins) {
                await notificationService_1.notificationService.create({
                    user: admin._id,
                    title: 'Insurance Expiring Soon',
                    message: `Vehicle ${vehicle.vehicleName} (${vehicle.registrationNumber}) insurance expires on ${vehicle.insuranceExpiryDate?.toLocaleDateString()}`,
                    type: 'vehicle_insurance',
                    relatedEntity: { entityType: 'Vehicle', entityId: vehicle._id },
                });
                await (0, emailService_1.sendVehicleAlertEmail)(admin.email, vehicle.vehicleName, 'Insurance Expiry', vehicle.insuranceExpiryDate);
                alertsSent++;
            }
        }
        // MVPI expiry alerts
        const mvpiExpiring = await Vehicle_1.Vehicle.find({
            isDeleted: false,
            mvpiExpiryDate: { $gte: now, $lte: in30Days },
        });
        for (const vehicle of mvpiExpiring) {
            for (const admin of admins) {
                await notificationService_1.notificationService.create({
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
        const overdueAssignments = await VehicleAssignment_1.VehicleAssignment.find({
            status: 'Active',
            expectedReturnDate: { $lt: now },
            isDeleted: false,
        }).populate('vehicle assignedTo');
        for (const assignment of overdueAssignments) {
            assignment.status = 'Overdue';
            await assignment.save();
            for (const admin of admins) {
                await notificationService_1.notificationService.create({
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
        const serviceDue = await VehicleMaintenance_1.VehicleMaintenance.find({
            isDeleted: false,
            nextDueDate: { $gte: now, $lte: in30Days },
            maintenanceType: { $in: ['Service Due', 'Oil Change'] },
        }).populate('vehicle');
        for (const maintenance of serviceDue) {
            for (const admin of admins) {
                await notificationService_1.notificationService.create({
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
    async getExportData(filters) {
        return Vehicle_1.Vehicle.find(this.buildVehicleFilter(filters))
            .populate(this.vehiclePopulate)
            .sort({ vehicleName: 1 });
    }
}
exports.VehicleService = VehicleService;
exports.vehicleService = new VehicleService();
//# sourceMappingURL=vehicleService.js.map