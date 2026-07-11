"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportVehiclesPdf = exports.exportVehiclesExcel = exports.getFleetDashboard = exports.getMaintenanceHistory = exports.createMaintenance = exports.returnVehicle = exports.createAssignment = exports.getAssignment = exports.getAssignments = exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicle = exports.getVehicles = void 0;
const vehicleService_1 = require("../services/vehicleService");
const ApiResponse_1 = require("../utils/ApiResponse");
const pagination_1 = require("../utils/pagination");
const helpers_1 = require("../utils/helpers");
const params_1 = require("../utils/params");
// Vehicles
const getVehicles = async (req, res, next) => {
    try {
        const result = await vehicleService_1.vehicleService.getVehicles({
            search: req.query.search,
            status: req.query.status,
            fuelType: req.query.fuelType,
            assignedProject: req.query.assignedProject,
            assignedEmployee: req.query.assignedEmployee,
        }, (0, pagination_1.getPagination)(req));
        res.json(ApiResponse_1.ApiResponse.success('Vehicles retrieved', result.data, { pagination: result.pagination }));
    }
    catch (error) {
        next(error);
    }
};
exports.getVehicles = getVehicles;
const getVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleService_1.vehicleService.getVehicleById((0, params_1.getParam)(req, 'id'));
        res.json(ApiResponse_1.ApiResponse.success('Vehicle retrieved', vehicle));
    }
    catch (error) {
        next(error);
    }
};
exports.getVehicle = getVehicle;
const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleService_1.vehicleService.createVehicle({
            ...req.body,
            createdBy: req.user._id.toString(),
        });
        res.status(201).json(ApiResponse_1.ApiResponse.success('Vehicle created', vehicle));
    }
    catch (error) {
        next(error);
    }
};
exports.createVehicle = createVehicle;
const updateVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleService_1.vehicleService.updateVehicle((0, params_1.getParam)(req, 'id'), req.body, req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Vehicle updated', vehicle));
    }
    catch (error) {
        next(error);
    }
};
exports.updateVehicle = updateVehicle;
const deleteVehicle = async (req, res, next) => {
    try {
        await vehicleService_1.vehicleService.deleteVehicle((0, params_1.getParam)(req, 'id'), req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Vehicle deleted'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteVehicle = deleteVehicle;
// Assignments
const getAssignments = async (req, res, next) => {
    try {
        const result = await vehicleService_1.vehicleService.getAssignments({
            vehicle: req.query.vehicle,
            assignedTo: req.query.assignedTo,
            status: req.query.status,
            project: req.query.project,
        }, (0, pagination_1.getPagination)(req));
        res.json(ApiResponse_1.ApiResponse.success('Assignments retrieved', result.data, { pagination: result.pagination }));
    }
    catch (error) {
        next(error);
    }
};
exports.getAssignments = getAssignments;
const getAssignment = async (req, res, next) => {
    try {
        const assignment = await vehicleService_1.vehicleService.getAssignmentById((0, params_1.getParam)(req, 'id'));
        res.json(ApiResponse_1.ApiResponse.success('Assignment retrieved', assignment));
    }
    catch (error) {
        next(error);
    }
};
exports.getAssignment = getAssignment;
const createAssignment = async (req, res, next) => {
    try {
        const photos = req.files;
        const assignment = await vehicleService_1.vehicleService.createAssignment({ ...req.body, assignedBy: req.user._id.toString() }, photos);
        res.status(201).json(ApiResponse_1.ApiResponse.success('Assignment created', assignment));
    }
    catch (error) {
        next(error);
    }
};
exports.createAssignment = createAssignment;
const returnVehicle = async (req, res, next) => {
    try {
        const photos = req.files;
        const assignment = await vehicleService_1.vehicleService.returnVehicle((0, params_1.getParam)(req, 'id'), { ...req.body, returnedBy: req.user._id.toString() }, photos);
        res.json(ApiResponse_1.ApiResponse.success('Vehicle returned', assignment));
    }
    catch (error) {
        next(error);
    }
};
exports.returnVehicle = returnVehicle;
// Maintenance
const createMaintenance = async (req, res, next) => {
    try {
        const maintenance = await vehicleService_1.vehicleService.createMaintenance({
            ...req.body,
            createdBy: req.user._id.toString(),
        });
        res.status(201).json(ApiResponse_1.ApiResponse.success('Maintenance record created', maintenance));
    }
    catch (error) {
        next(error);
    }
};
exports.createMaintenance = createMaintenance;
const getMaintenanceHistory = async (req, res, next) => {
    try {
        const result = await vehicleService_1.vehicleService.getMaintenanceHistory((0, params_1.getParam)(req, 'vehicleId'), (0, pagination_1.getPagination)(req));
        res.json(ApiResponse_1.ApiResponse.success('Maintenance history retrieved', result.data, { pagination: result.pagination }));
    }
    catch (error) {
        next(error);
    }
};
exports.getMaintenanceHistory = getMaintenanceHistory;
// Dashboard
const getFleetDashboard = async (req, res, next) => {
    try {
        const stats = await vehicleService_1.vehicleService.getFleetDashboard();
        res.json(ApiResponse_1.ApiResponse.success('Fleet dashboard retrieved', stats));
    }
    catch (error) {
        next(error);
    }
};
exports.getFleetDashboard = getFleetDashboard;
const exportVehiclesExcel = async (req, res, next) => {
    try {
        const vehicles = await vehicleService_1.vehicleService.getExportData({
            search: req.query.search,
            status: req.query.status,
        });
        const rows = vehicles.map((v) => ({
            vehicleId: v.vehicleId,
            vehicleName: v.vehicleName,
            registrationNumber: v.registrationNumber,
            make: v.make,
            model: v.model,
            year: v.year,
            status: v.currentStatus,
            currentKm: v.currentKm,
            fuelType: v.fuelType,
        }));
        await (0, helpers_1.exportToExcel)(res, `vehicles-${Date.now()}`, [
            { header: 'Vehicle ID', key: 'vehicleId', width: 15 },
            { header: 'Name', key: 'vehicleName', width: 20 },
            { header: 'Registration', key: 'registrationNumber', width: 15 },
            { header: 'Make', key: 'make', width: 12 },
            { header: 'Model', key: 'model', width: 12 },
            { header: 'Year', key: 'year', width: 8 },
            { header: 'Status', key: 'status', width: 18 },
            { header: 'KM', key: 'currentKm', width: 10 },
            { header: 'Fuel', key: 'fuelType', width: 10 },
        ], rows);
    }
    catch (error) {
        next(error);
    }
};
exports.exportVehiclesExcel = exportVehiclesExcel;
const exportVehiclesPdf = async (req, res, next) => {
    try {
        const vehicles = await vehicleService_1.vehicleService.getExportData({
            search: req.query.search,
            status: req.query.status,
        });
        (0, helpers_1.exportToPdf)(res, `vehicles-${Date.now()}`, 'Fleet Report', ['ID', 'Name', 'Registration', 'Status', 'KM'], vehicles.map((v) => [
            v.vehicleId,
            v.vehicleName,
            v.registrationNumber,
            v.currentStatus,
            String(v.currentKm),
        ]));
    }
    catch (error) {
        next(error);
    }
};
exports.exportVehiclesPdf = exportVehiclesPdf;
//# sourceMappingURL=vehicleController.js.map