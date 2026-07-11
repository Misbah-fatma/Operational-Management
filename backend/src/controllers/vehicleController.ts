import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { vehicleService } from '../services/vehicleService';
import { ApiResponse } from '../utils/ApiResponse';
import { getPagination } from '../utils/pagination';
import { exportToExcel, exportToPdf } from '../utils/helpers';
import { getParam } from '../utils/params';

// Vehicles
export const getVehicles = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await vehicleService.getVehicles(
      {
        search: req.query.search as string,
        status: req.query.status as string,
        fuelType: req.query.fuelType as string,
        assignedProject: req.query.assignedProject as string,
        assignedEmployee: req.query.assignedEmployee as string,
      },
      getPagination(req),
    );
    res.json(ApiResponse.success('Vehicles retrieved', result.data, { pagination: result.pagination }));
  } catch (error) {
    next(error);
  }
};

export const getVehicle = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehicleService.getVehicleById(getParam(req, 'id'));
    res.json(ApiResponse.success('Vehicle retrieved', vehicle));
  } catch (error) {
    next(error);
  }
};

export const createVehicle = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehicleService.createVehicle({
      ...req.body,
      createdBy: req.user!._id.toString(),
    });
    res.status(201).json(ApiResponse.success('Vehicle created', vehicle));
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const vehicle = await vehicleService.updateVehicle(
      getParam(req, 'id'),
      req.body,
      req.user!._id.toString(),
    );
    res.json(ApiResponse.success('Vehicle updated', vehicle));
  } catch (error) {
    next(error);
  }
};

export const deleteVehicle = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await vehicleService.deleteVehicle(getParam(req, 'id'), req.user!._id.toString());
    res.json(ApiResponse.success('Vehicle deleted'));
  } catch (error) {
    next(error);
  }
};

// Assignments
export const getAssignments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await vehicleService.getAssignments(
      {
        vehicle: req.query.vehicle as string,
        assignedTo: req.query.assignedTo as string,
        status: req.query.status as string,
        project: req.query.project as string,
      },
      getPagination(req),
    );
    res.json(ApiResponse.success('Assignments retrieved', result.data, { pagination: result.pagination }));
  } catch (error) {
    next(error);
  }
};

export const getAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const assignment = await vehicleService.getAssignmentById(getParam(req, 'id'));
    res.json(ApiResponse.success('Assignment retrieved', assignment));
  } catch (error) {
    next(error);
  }
};

export const createAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const photos = req.files as Record<string, Express.Multer.File[]>;
    const assignment = await vehicleService.createAssignment(
      { ...req.body, assignedBy: req.user!._id.toString() },
      photos,
    );
    res.status(201).json(ApiResponse.success('Assignment created', assignment));
  } catch (error) {
    next(error);
  }
};

export const returnVehicle = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const photos = req.files as Record<string, Express.Multer.File[]>;
    const assignment = await vehicleService.returnVehicle(
      getParam(req, 'id'),
      { ...req.body, returnedBy: req.user!._id.toString() },
      photos,
    );
    res.json(ApiResponse.success('Vehicle returned', assignment));
  } catch (error) {
    next(error);
  }
};

export const updateAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const assignment = await vehicleService.updateAssignment(getParam(req, 'id'), req.body);
    res.json(ApiResponse.success('Assignment updated', assignment));
  } catch (error) {
    next(error);
  }
};

export const deleteAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await vehicleService.deleteAssignment(getParam(req, 'id'));
    res.json(ApiResponse.success('Assignment deleted'));
  } catch (error) {
    next(error);
  }
};

// Maintenance
export const createMaintenance = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const maintenance = await vehicleService.createMaintenance({
      ...req.body,
      createdBy: req.user!._id.toString(),
    });
    res.status(201).json(ApiResponse.success('Maintenance record created', maintenance));
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await vehicleService.getMaintenanceHistory(
      getParam(req, 'vehicleId'),
      getPagination(req),
    );
    res.json(ApiResponse.success('Maintenance history retrieved', result.data, { pagination: result.pagination }));
  } catch (error) {
    next(error);
  }
};

// Dashboard
export const getFleetDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await vehicleService.getFleetDashboard();
    res.json(ApiResponse.success('Fleet dashboard retrieved', stats));
  } catch (error) {
    next(error);
  }
};

export const exportVehiclesExcel = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const vehicles = await vehicleService.getExportData({
      search: req.query.search as string,
      status: req.query.status as string,
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

    await exportToExcel(
      res,
      `vehicles-${Date.now()}`,
      [
        { header: 'Vehicle ID', key: 'vehicleId', width: 15 },
        { header: 'Name', key: 'vehicleName', width: 20 },
        { header: 'Registration', key: 'registrationNumber', width: 15 },
        { header: 'Make', key: 'make', width: 12 },
        { header: 'Model', key: 'model', width: 12 },
        { header: 'Year', key: 'year', width: 8 },
        { header: 'Status', key: 'status', width: 18 },
        { header: 'KM', key: 'currentKm', width: 10 },
        { header: 'Fuel', key: 'fuelType', width: 10 },
      ],
      rows,
    );
  } catch (error) {
    next(error);
  }
};

export const exportVehiclesPdf = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const vehicles = await vehicleService.getExportData({
      search: req.query.search as string,
      status: req.query.status as string,
    });

    exportToPdf(
      res,
      `vehicles-${Date.now()}`,
      'Fleet Report',
      ['ID', 'Name', 'Registration', 'Status', 'KM'],
      vehicles.map((v) => [
        v.vehicleId,
        v.vehicleName,
        v.registrationNumber,
        v.currentStatus,
        String(v.currentKm),
      ]),
    );
  } catch (error) {
    next(error);
  }
};
