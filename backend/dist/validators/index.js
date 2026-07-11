"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportQueryValidation = exports.bulkActionValidation = exports.projectDocumentValidation = exports.projectProgressValidation = exports.projectAssignmentValidation = exports.milestoneValidation = exports.projectValidation = exports.paginationValidation = exports.idParamValidation = exports.maintenanceValidation = exports.returnValidation = exports.assignmentValidation = exports.vehicleValidation = exports.certificateValidation = exports.changePasswordValidation = exports.registerValidation = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
const constants_1 = require("../constants");
exports.loginValidation = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
exports.registerValidation = [
    (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('role').optional().isIn(constants_1.ALL_ROLES).withMessage('Invalid role'),
];
exports.changePasswordValidation = [
    (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];
exports.certificateValidation = [
    (0, express_validator_1.body)('certificateNumber').trim().notEmpty().withMessage('Certificate number is required'),
    (0, express_validator_1.body)('certificateName').trim().notEmpty().withMessage('Certificate name is required'),
    (0, express_validator_1.body)('category').isIn(constants_1.CERTIFICATE_CATEGORIES).withMessage('Invalid category'),
    (0, express_validator_1.body)('issueDate').isISO8601().withMessage('Valid issue date is required'),
    (0, express_validator_1.body)('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
    (0, express_validator_1.body)('issuingAuthority').trim().notEmpty().withMessage('Issuing authority is required'),
    (0, express_validator_1.body)('renewalDate').optional().isISO8601(),
];
exports.vehicleValidation = [
    (0, express_validator_1.body)('vehicleName').trim().notEmpty().withMessage('Vehicle name is required'),
    (0, express_validator_1.body)('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
    (0, express_validator_1.body)('make').trim().notEmpty().withMessage('Make is required'),
    (0, express_validator_1.body)('model').trim().notEmpty().withMessage('Model is required'),
    (0, express_validator_1.body)('year').isInt({ min: 1900, max: 2100 }).withMessage('Valid year is required'),
    (0, express_validator_1.body)('fuelType').isIn(constants_1.FUEL_TYPES).withMessage('Invalid fuel type'),
    (0, express_validator_1.body)('currentKm').optional().isNumeric(),
    (0, express_validator_1.body)('insuranceExpiryDate').optional().isISO8601(),
    (0, express_validator_1.body)('mvpiExpiryDate').optional().isISO8601(),
];
exports.assignmentValidation = [
    (0, express_validator_1.body)('vehicle').notEmpty().withMessage('Vehicle is required'),
    (0, express_validator_1.body)('assignedTo').notEmpty().withMessage('Assignee is required'),
    (0, express_validator_1.body)('startingKm').isNumeric().withMessage('Starting KM is required'),
    (0, express_validator_1.body)('fuelLevel').isIn(constants_1.FUEL_LEVELS).withMessage('Valid fuel level is required'),
    (0, express_validator_1.body)('expectedReturnDate').optional().isISO8601(),
];
exports.returnValidation = [
    (0, express_validator_1.body)('finalKm').isNumeric().withMessage('Final KM is required'),
    (0, express_validator_1.body)('fuelLevel').isIn(constants_1.FUEL_LEVELS).withMessage('Valid fuel level is required'),
    (0, express_validator_1.body)('vehicleCondition').isIn(constants_1.VEHICLE_CONDITIONS).withMessage('Valid vehicle condition is required'),
];
exports.maintenanceValidation = [
    (0, express_validator_1.body)('vehicle').notEmpty().withMessage('Vehicle is required'),
    (0, express_validator_1.body)('maintenanceType').isIn(constants_1.MAINTENANCE_TYPES).withMessage('Invalid maintenance type'),
    (0, express_validator_1.body)('description').trim().notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('cost').optional().isNumeric(),
    (0, express_validator_1.body)('scheduledDate').optional().isISO8601(),
    (0, express_validator_1.body)('completedDate').optional().isISO8601(),
    (0, express_validator_1.body)('nextDueDate').optional().isISO8601(),
];
exports.idParamValidation = [(0, express_validator_1.param)('id').isMongoId().withMessage('Invalid ID')];
exports.paginationValidation = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }),
];
exports.projectValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Project name is required'),
    (0, express_validator_1.body)('code').optional().trim(),
    (0, express_validator_1.body)('client').optional().trim(),
    (0, express_validator_1.body)('contractNumber').optional().trim(),
    (0, express_validator_1.body)('contractValue').optional().isNumeric(),
    (0, express_validator_1.body)('budget').optional().isNumeric(),
    (0, express_validator_1.body)('startDate').optional().isISO8601(),
    (0, express_validator_1.body)('endDate').optional().isISO8601(),
    (0, express_validator_1.body)('status').optional().isIn([
        'Proposal Stage', 'Tender Stage', 'Under Review', 'Awarded', 'Planning Stage',
        'Pending Execution', 'Active', 'On Hold', 'Completed', 'Closed',
    ]),
    (0, express_validator_1.body)('projectManager').optional().isMongoId(),
];
exports.milestoneValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Milestone name is required'),
    (0, express_validator_1.body)('plannedDate').optional().isISO8601(),
    (0, express_validator_1.body)('actualDate').optional().isISO8601(),
    (0, express_validator_1.body)('progressPercent').optional().isFloat({ min: 0, max: 100 }),
];
exports.projectAssignmentValidation = [
    (0, express_validator_1.body)('resourceType').isIn(['employee', 'vehicle', 'equipment']).withMessage('Invalid resource type'),
    (0, express_validator_1.body)('employee').optional().isMongoId(),
    (0, express_validator_1.body)('vehicle').optional().isMongoId(),
    (0, express_validator_1.body)('equipment').optional().isMongoId(),
    (0, express_validator_1.body)('assignmentDate').isISO8601().withMessage('Assignment date is required'),
    (0, express_validator_1.body)('employeeRole').optional().isIn(['engineer', 'supervisor', 'technician']),
];
exports.projectProgressValidation = [
    (0, express_validator_1.body)('updateType').isIn(['weekly', 'monthly']).withMessage('Invalid update type'),
    (0, express_validator_1.body)('date').isISO8601().withMessage('Date is required'),
    (0, express_validator_1.body)('progressPercent').isFloat({ min: 0, max: 100 }).withMessage('Progress must be 0-100'),
];
exports.projectDocumentValidation = [
    (0, express_validator_1.body)('category').isIn(['Drawings', 'BOQ', 'Reports', 'Contracts', 'Approvals']),
    (0, express_validator_1.body)('fileName').optional().trim(),
    (0, express_validator_1.body)('version').optional().trim(),
];
exports.bulkActionValidation = [
    (0, express_validator_1.body)('ids').isArray({ min: 1 }).withMessage('IDs array is required'),
    (0, express_validator_1.body)('action').isIn(['delete', 'archive']).withMessage('Invalid action'),
];
exports.reportQueryValidation = [
    (0, express_validator_1.query)('reportType').isIn([
        'project', 'certificate', 'vehicle_assignment', 'vehicle_inspection',
        'vehicle_maintenance', 'manpower_allocation', 'resource_allocation', 'financial_summary',
    ]),
];
//# sourceMappingURL=index.js.map