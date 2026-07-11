import { body, param, query } from 'express-validator';
import { ALL_ROLES, CERTIFICATE_CATEGORIES, FUEL_TYPES, FUEL_LEVELS, VEHICLE_CONDITIONS, MAINTENANCE_TYPES } from '../constants';

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(ALL_ROLES).withMessage('Invalid role'),
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

export const certificateValidation = [
  body('certificateNumber').trim().notEmpty().withMessage('Certificate number is required'),
  body('certificateName').trim().notEmpty().withMessage('Certificate name is required'),
  body('category').isIn(CERTIFICATE_CATEGORIES).withMessage('Invalid category'),
  body('issueDate').isISO8601().withMessage('Valid issue date is required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('issuingAuthority').trim().notEmpty().withMessage('Issuing authority is required'),
  body('renewalDate').optional().isISO8601(),
];

export const vehicleValidation = [
  body('vehicleName').trim().notEmpty().withMessage('Vehicle name is required'),
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: 2100 }).withMessage('Valid year is required'),
  body('fuelType').isIn(FUEL_TYPES).withMessage('Invalid fuel type'),
  body('currentKm').optional().isNumeric(),
  body('insuranceExpiryDate').optional().isISO8601(),
  body('mvpiExpiryDate').optional().isISO8601(),
];

export const assignmentValidation = [
  body('vehicle').notEmpty().withMessage('Vehicle is required'),
  body('assignedTo').notEmpty().withMessage('Assignee is required'),
  body('startingKm').isNumeric().withMessage('Starting KM is required'),
  body('fuelLevel').isIn(FUEL_LEVELS).withMessage('Valid fuel level is required'),
  body('expectedReturnDate').optional().isISO8601(),
];

export const assignmentUpdateValidation = [
  body('vehicle').optional().notEmpty().withMessage('Vehicle is required'),
  body('assignedTo').optional().notEmpty().withMessage('Assignee is required'),
  body('startingKm').optional().isNumeric().withMessage('Starting KM must be a number'),
  body('fuelLevel').optional().isIn(FUEL_LEVELS).withMessage('Valid fuel level is required'),
  body('expectedReturnDate').optional({ values: 'null' }).isISO8601(),
  body('assignmentDate').optional().isISO8601(),
  body('notes').optional().trim(),
  body('project').optional({ values: 'null' }),
];

export const returnValidation = [
  body('finalKm').isNumeric().withMessage('Final KM is required'),
  body('fuelLevel').isIn(FUEL_LEVELS).withMessage('Valid fuel level is required'),
  body('vehicleCondition').isIn(VEHICLE_CONDITIONS).withMessage('Valid vehicle condition is required'),
];

export const maintenanceValidation = [
  body('vehicle').notEmpty().withMessage('Vehicle is required'),
  body('maintenanceType').isIn(MAINTENANCE_TYPES).withMessage('Invalid maintenance type'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('cost').optional().isNumeric(),
  body('scheduledDate').optional().isISO8601(),
  body('completedDate').optional().isISO8601(),
  body('nextDueDate').optional().isISO8601(),
];

export const idParamValidation = [param('id').isMongoId().withMessage('Invalid ID')];

export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

export const projectValidation = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('code').optional().trim(),
  body('client').optional().trim(),
  body('contractNumber').optional().trim(),
  body('contractValue').optional().isNumeric(),
  body('budget').optional().isNumeric(),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601(),
  body('status').optional().isIn([
    'Proposal Stage', 'Tender Stage', 'Under Review', 'Awarded', 'Planning Stage',
    'Pending Execution', 'Active', 'On Hold', 'Completed', 'Closed',
  ]),
  body('projectManager').optional().isMongoId(),
];

export const milestoneValidation = [
  body('name').trim().notEmpty().withMessage('Milestone name is required'),
  body('plannedDate').optional().isISO8601(),
  body('actualDate').optional().isISO8601(),
  body('progressPercent').optional().isFloat({ min: 0, max: 100 }),
];

export const projectAssignmentValidation = [
  body('resourceType').isIn(['employee', 'vehicle', 'equipment']).withMessage('Invalid resource type'),
  body('employee').optional().isMongoId(),
  body('vehicle').optional().isMongoId(),
  body('equipment').optional().isMongoId(),
  body('assignmentDate').isISO8601().withMessage('Assignment date is required'),
  body('employeeRole').optional().isIn(['engineer', 'supervisor', 'technician']),
];

export const projectProgressValidation = [
  body('updateType').isIn(['weekly', 'monthly']).withMessage('Invalid update type'),
  body('date').isISO8601().withMessage('Date is required'),
  body('progressPercent').isFloat({ min: 0, max: 100 }).withMessage('Progress must be 0-100'),
];

export const projectDocumentValidation = [
  body('category').isIn(['Drawings', 'BOQ', 'Reports', 'Contracts', 'Approvals']),
  body('fileName').optional().trim(),
  body('version').optional().trim(),
];

export const bulkActionValidation = [
  body('ids').isArray({ min: 1 }).withMessage('IDs array is required'),
  body('action').isIn(['delete', 'archive']).withMessage('Invalid action'),
];

export const reportQueryValidation = [
  query('reportType').isIn([
    'project', 'certificate', 'vehicle_assignment', 'vehicle_inspection',
    'vehicle_maintenance', 'manpower_allocation', 'resource_allocation', 'financial_summary',
  ]),
];
