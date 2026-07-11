import { Router } from 'express';
import * as vehicleController from '../controllers/vehicleController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import {
  uploadVehiclePhotos,
  uploadReturnPhotos,
  handleMulterError,
} from '../middleware/upload';
import { auditLog } from '../middleware/audit';
import {
  vehicleValidation,
  assignmentValidation,
  assignmentUpdateValidation,
  returnValidation,
  maintenanceValidation,
  idParamValidation,
  paginationValidation,
} from '../validators';
import { PERMISSIONS } from '../constants';

const router = Router();

router.use(authenticate);

// Dashboard & Export
router.get('/dashboard', authorize(PERMISSIONS.DASHBOARD_READ), vehicleController.getFleetDashboard);
router.get('/export/excel', authorize(PERMISSIONS.VEHICLES_EXPORT), vehicleController.exportVehiclesExcel);
router.get('/export/pdf', authorize(PERMISSIONS.VEHICLES_EXPORT), vehicleController.exportVehiclesPdf);

// Assignments (before /:id to avoid route conflicts)
router.get('/assignments/list', authorize(PERMISSIONS.ASSIGNMENTS_READ), validate(paginationValidation), vehicleController.getAssignments);
router.get('/assignments/:id', authorize(PERMISSIONS.ASSIGNMENTS_READ), validate(idParamValidation), vehicleController.getAssignment);
router.post(
  '/assignments',
  authorize(PERMISSIONS.ASSIGNMENTS_CREATE),
  uploadVehiclePhotos,
  handleMulterError,
  validate(assignmentValidation),
  auditLog('CREATE', 'VehicleAssignment'),
  vehicleController.createAssignment,
);
router.put(
  '/assignments/:id',
  authorize(PERMISSIONS.ASSIGNMENTS_UPDATE),
  validate([...idParamValidation, ...assignmentUpdateValidation]),
  auditLog('UPDATE', 'VehicleAssignment'),
  vehicleController.updateAssignment,
);
router.delete(
  '/assignments/:id',
  authorize(PERMISSIONS.ASSIGNMENTS_DELETE),
  validate(idParamValidation),
  auditLog('DELETE', 'VehicleAssignment'),
  vehicleController.deleteAssignment,
);
router.post(
  '/assignments/:id/return',
  authorize(PERMISSIONS.ASSIGNMENTS_RETURN),
  uploadReturnPhotos,
  handleMulterError,
  validate([...idParamValidation, ...returnValidation]),
  auditLog('RETURN', 'VehicleAssignment'),
  vehicleController.returnVehicle,
);

// Maintenance
router.post('/maintenance', authorize(PERMISSIONS.MAINTENANCE_CREATE), validate(maintenanceValidation), auditLog('CREATE', 'VehicleMaintenance'), vehicleController.createMaintenance);
router.get('/:vehicleId/maintenance', authorize(PERMISSIONS.MAINTENANCE_READ), validate(paginationValidation), vehicleController.getMaintenanceHistory);

// Vehicles CRUD
router.get('/', authorize(PERMISSIONS.VEHICLES_READ), validate(paginationValidation), vehicleController.getVehicles);
router.post('/', authorize(PERMISSIONS.VEHICLES_CREATE), validate(vehicleValidation), auditLog('CREATE', 'Vehicle'), vehicleController.createVehicle);
router.get('/:id', authorize(PERMISSIONS.VEHICLES_READ), validate(idParamValidation), vehicleController.getVehicle);
router.put('/:id', authorize(PERMISSIONS.VEHICLES_UPDATE), validate([...idParamValidation, ...vehicleValidation]), auditLog('UPDATE', 'Vehicle'), vehicleController.updateVehicle);
router.delete('/:id', authorize(PERMISSIONS.VEHICLES_DELETE), validate(idParamValidation), auditLog('DELETE', 'Vehicle'), vehicleController.deleteVehicle);

export default router;
