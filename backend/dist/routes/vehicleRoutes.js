"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicleController = __importStar(require("../controllers/vehicleController"));
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const validate_1 = require("../middleware/validate");
const upload_1 = require("../middleware/upload");
const audit_1 = require("../middleware/audit");
const validators_1 = require("../validators");
const constants_1 = require("../constants");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Dashboard & Export
router.get('/dashboard', (0, rbac_1.authorize)(constants_1.PERMISSIONS.DASHBOARD_READ), vehicleController.getFleetDashboard);
router.get('/export/excel', (0, rbac_1.authorize)(constants_1.PERMISSIONS.VEHICLES_EXPORT), vehicleController.exportVehiclesExcel);
router.get('/export/pdf', (0, rbac_1.authorize)(constants_1.PERMISSIONS.VEHICLES_EXPORT), vehicleController.exportVehiclesPdf);
// Assignments (before /:id to avoid route conflicts)
router.get('/assignments/list', (0, rbac_1.authorize)(constants_1.PERMISSIONS.ASSIGNMENTS_READ), (0, validate_1.validate)(validators_1.paginationValidation), vehicleController.getAssignments);
router.get('/assignments/:id', (0, rbac_1.authorize)(constants_1.PERMISSIONS.ASSIGNMENTS_READ), (0, validate_1.validate)(validators_1.idParamValidation), vehicleController.getAssignment);
router.post('/assignments', (0, rbac_1.authorize)(constants_1.PERMISSIONS.ASSIGNMENTS_CREATE), upload_1.uploadVehiclePhotos, upload_1.handleMulterError, (0, validate_1.validate)(validators_1.assignmentValidation), (0, audit_1.auditLog)('CREATE', 'VehicleAssignment'), vehicleController.createAssignment);
router.post('/assignments/:id/return', (0, rbac_1.authorize)(constants_1.PERMISSIONS.ASSIGNMENTS_RETURN), upload_1.uploadReturnPhotos, upload_1.handleMulterError, (0, validate_1.validate)([...validators_1.idParamValidation, ...validators_1.returnValidation]), (0, audit_1.auditLog)('RETURN', 'VehicleAssignment'), vehicleController.returnVehicle);
// Maintenance
router.post('/maintenance', (0, rbac_1.authorize)(constants_1.PERMISSIONS.MAINTENANCE_CREATE), (0, validate_1.validate)(validators_1.maintenanceValidation), (0, audit_1.auditLog)('CREATE', 'VehicleMaintenance'), vehicleController.createMaintenance);
router.get('/:vehicleId/maintenance', (0, rbac_1.authorize)(constants_1.PERMISSIONS.MAINTENANCE_READ), (0, validate_1.validate)(validators_1.paginationValidation), vehicleController.getMaintenanceHistory);
// Vehicles CRUD
router.get('/', (0, rbac_1.authorize)(constants_1.PERMISSIONS.VEHICLES_READ), (0, validate_1.validate)(validators_1.paginationValidation), vehicleController.getVehicles);
router.post('/', (0, rbac_1.authorize)(constants_1.PERMISSIONS.VEHICLES_CREATE), (0, validate_1.validate)(validators_1.vehicleValidation), (0, audit_1.auditLog)('CREATE', 'Vehicle'), vehicleController.createVehicle);
router.get('/:id', (0, rbac_1.authorize)(constants_1.PERMISSIONS.VEHICLES_READ), (0, validate_1.validate)(validators_1.idParamValidation), vehicleController.getVehicle);
router.put('/:id', (0, rbac_1.authorize)(constants_1.PERMISSIONS.VEHICLES_UPDATE), (0, validate_1.validate)([...validators_1.idParamValidation, ...validators_1.vehicleValidation]), (0, audit_1.auditLog)('UPDATE', 'Vehicle'), vehicleController.updateVehicle);
router.delete('/:id', (0, rbac_1.authorize)(constants_1.PERMISSIONS.VEHICLES_DELETE), (0, validate_1.validate)(validators_1.idParamValidation), (0, audit_1.auditLog)('DELETE', 'Vehicle'), vehicleController.deleteVehicle);
exports.default = router;
//# sourceMappingURL=vehicleRoutes.js.map