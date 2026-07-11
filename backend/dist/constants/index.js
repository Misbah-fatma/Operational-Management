"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPORT_TYPES = exports.PROJECT_ISSUE_TYPES = exports.PROJECT_DOCUMENT_CATEGORIES = exports.PROJECT_PROGRESS_TYPES = exports.PROJECT_PLANNING_TYPES = exports.PROJECT_EMPLOYEE_ROLES = exports.PROJECT_ASSIGNMENT_STATUSES = exports.PROJECT_RESOURCE_TYPES = exports.PROJECT_DELAY_STATUSES = exports.PROJECT_STATUSES = exports.FUEL_LEVELS = exports.VEHICLE_CONDITIONS = exports.MAINTENANCE_TYPES = exports.FUEL_TYPES = exports.VEHICLE_STATUSES = exports.CERTIFICATE_STATUSES = exports.CERTIFICATE_CATEGORIES = exports.ASSIGNABLE_ROLES = exports.ROLE_PERMISSIONS = exports.PERMISSIONS = exports.ALL_ROLES = exports.ROLES = void 0;
exports.ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGER: 'manager',
    ENGINEER: 'engineer',
    TECHNICIAN: 'technician',
    DRIVER: 'driver',
    VIEWER: 'viewer',
};
exports.ALL_ROLES = Object.values(exports.ROLES);
exports.PERMISSIONS = {
    // Users
    USERS_READ: 'users:read',
    USERS_CREATE: 'users:create',
    USERS_UPDATE: 'users:update',
    USERS_DELETE: 'users:delete',
    // Certificates
    CERTIFICATES_READ: 'certificates:read',
    CERTIFICATES_CREATE: 'certificates:create',
    CERTIFICATES_UPDATE: 'certificates:update',
    CERTIFICATES_DELETE: 'certificates:delete',
    CERTIFICATES_EXPORT: 'certificates:export',
    // Vehicles
    VEHICLES_READ: 'vehicles:read',
    VEHICLES_CREATE: 'vehicles:create',
    VEHICLES_UPDATE: 'vehicles:update',
    VEHICLES_DELETE: 'vehicles:delete',
    VEHICLES_EXPORT: 'vehicles:export',
    // Assignments
    ASSIGNMENTS_READ: 'assignments:read',
    ASSIGNMENTS_CREATE: 'assignments:create',
    ASSIGNMENTS_UPDATE: 'assignments:update',
    ASSIGNMENTS_RETURN: 'assignments:return',
    // Maintenance
    MAINTENANCE_READ: 'maintenance:read',
    MAINTENANCE_CREATE: 'maintenance:create',
    MAINTENANCE_UPDATE: 'maintenance:update',
    // Notifications
    NOTIFICATIONS_READ: 'notifications:read',
    NOTIFICATIONS_MANAGE: 'notifications:manage',
    // Audit
    AUDIT_READ: 'audit:read',
    // Dashboard
    DASHBOARD_READ: 'dashboard:read',
    // Projects
    PROJECTS_READ: 'projects:read',
    PROJECTS_CREATE: 'projects:create',
    PROJECTS_UPDATE: 'projects:update',
    PROJECTS_DELETE: 'projects:delete',
    PROJECTS_EXPORT: 'projects:export',
    PROJECTS_ARCHIVE: 'projects:archive',
    // Reports
    REPORTS_READ: 'reports:read',
    REPORTS_EXPORT: 'reports:export',
};
const ALL_PERMISSIONS = Object.values(exports.PERMISSIONS);
exports.ROLE_PERMISSIONS = {
    [exports.ROLES.SUPER_ADMIN]: ALL_PERMISSIONS,
    [exports.ROLES.ADMIN]: ALL_PERMISSIONS.filter((p) => p !== exports.PERMISSIONS.USERS_DELETE),
    [exports.ROLES.MANAGER]: [
        exports.PERMISSIONS.USERS_READ,
        exports.PERMISSIONS.CERTIFICATES_READ,
        exports.PERMISSIONS.CERTIFICATES_CREATE,
        exports.PERMISSIONS.CERTIFICATES_UPDATE,
        exports.PERMISSIONS.CERTIFICATES_DELETE,
        exports.PERMISSIONS.CERTIFICATES_EXPORT,
        exports.PERMISSIONS.VEHICLES_READ,
        exports.PERMISSIONS.VEHICLES_CREATE,
        exports.PERMISSIONS.VEHICLES_UPDATE,
        exports.PERMISSIONS.VEHICLES_DELETE,
        exports.PERMISSIONS.VEHICLES_EXPORT,
        exports.PERMISSIONS.ASSIGNMENTS_READ,
        exports.PERMISSIONS.ASSIGNMENTS_CREATE,
        exports.PERMISSIONS.ASSIGNMENTS_UPDATE,
        exports.PERMISSIONS.ASSIGNMENTS_RETURN,
        exports.PERMISSIONS.MAINTENANCE_READ,
        exports.PERMISSIONS.MAINTENANCE_CREATE,
        exports.PERMISSIONS.MAINTENANCE_UPDATE,
        exports.PERMISSIONS.NOTIFICATIONS_READ,
        exports.PERMISSIONS.DASHBOARD_READ,
        exports.PERMISSIONS.PROJECTS_READ,
        exports.PERMISSIONS.PROJECTS_CREATE,
        exports.PERMISSIONS.PROJECTS_UPDATE,
        exports.PERMISSIONS.PROJECTS_DELETE,
        exports.PERMISSIONS.PROJECTS_EXPORT,
        exports.PERMISSIONS.PROJECTS_ARCHIVE,
        exports.PERMISSIONS.REPORTS_READ,
        exports.PERMISSIONS.REPORTS_EXPORT,
    ],
    [exports.ROLES.ENGINEER]: [
        exports.PERMISSIONS.CERTIFICATES_READ,
        exports.PERMISSIONS.CERTIFICATES_EXPORT,
        exports.PERMISSIONS.VEHICLES_READ,
        exports.PERMISSIONS.ASSIGNMENTS_READ,
        exports.PERMISSIONS.ASSIGNMENTS_CREATE,
        exports.PERMISSIONS.ASSIGNMENTS_RETURN,
        exports.PERMISSIONS.MAINTENANCE_READ,
        exports.PERMISSIONS.NOTIFICATIONS_READ,
        exports.PERMISSIONS.DASHBOARD_READ,
        exports.PERMISSIONS.PROJECTS_READ,
        exports.PERMISSIONS.PROJECTS_UPDATE,
        exports.PERMISSIONS.REPORTS_READ,
    ],
    [exports.ROLES.TECHNICIAN]: [
        exports.PERMISSIONS.CERTIFICATES_READ,
        exports.PERMISSIONS.VEHICLES_READ,
        exports.PERMISSIONS.ASSIGNMENTS_READ,
        exports.PERMISSIONS.ASSIGNMENTS_RETURN,
        exports.PERMISSIONS.MAINTENANCE_READ,
        exports.PERMISSIONS.NOTIFICATIONS_READ,
        exports.PERMISSIONS.DASHBOARD_READ,
        exports.PERMISSIONS.PROJECTS_READ,
        exports.PERMISSIONS.REPORTS_READ,
    ],
    [exports.ROLES.DRIVER]: [
        exports.PERMISSIONS.VEHICLES_READ,
        exports.PERMISSIONS.ASSIGNMENTS_READ,
        exports.PERMISSIONS.ASSIGNMENTS_RETURN,
        exports.PERMISSIONS.NOTIFICATIONS_READ,
    ],
    [exports.ROLES.VIEWER]: [
        exports.PERMISSIONS.CERTIFICATES_READ,
        exports.PERMISSIONS.CERTIFICATES_EXPORT,
        exports.PERMISSIONS.VEHICLES_READ,
        exports.PERMISSIONS.ASSIGNMENTS_READ,
        exports.PERMISSIONS.MAINTENANCE_READ,
        exports.PERMISSIONS.NOTIFICATIONS_READ,
        exports.PERMISSIONS.DASHBOARD_READ,
        exports.PERMISSIONS.PROJECTS_READ,
        exports.PERMISSIONS.PROJECTS_EXPORT,
        exports.PERMISSIONS.REPORTS_READ,
        exports.PERMISSIONS.REPORTS_EXPORT,
    ],
};
exports.ASSIGNABLE_ROLES = [
    exports.ROLES.ENGINEER,
    exports.ROLES.TECHNICIAN,
    exports.ROLES.DRIVER,
];
exports.CERTIFICATE_CATEGORIES = [
    'Employee',
    'Equipment',
    'Vehicle',
    'Calibration',
    'Vendor',
    'Project',
];
exports.CERTIFICATE_STATUSES = [
    'Active',
    'Expiring Soon',
    'Expired',
    'Renewed',
    'Archived',
];
exports.VEHICLE_STATUSES = [
    'Available',
    'Assigned',
    'Under Maintenance',
    'Insurance Expired',
    'MVPI Expired',
    'Inactive',
];
exports.FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
exports.MAINTENANCE_TYPES = [
    'Insurance Renewal',
    'MVPI Renewal',
    'Service Due',
    'Oil Change',
    'Tyres',
    'Repairs',
];
exports.VEHICLE_CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'];
exports.FUEL_LEVELS = ['Empty', 'Quarter', 'Half', 'Three Quarter', 'Full'];
exports.PROJECT_STATUSES = [
    'Proposal Stage',
    'Tender Stage',
    'Under Review',
    'Awarded',
    'Planning Stage',
    'Pending Execution',
    'Active',
    'On Hold',
    'Completed',
    'Closed',
];
exports.PROJECT_DELAY_STATUSES = ['On Track', 'Delayed', 'At Risk', 'Ahead'];
exports.PROJECT_RESOURCE_TYPES = ['employee', 'vehicle', 'equipment'];
exports.PROJECT_ASSIGNMENT_STATUSES = ['Active', 'Released', 'Completed'];
exports.PROJECT_EMPLOYEE_ROLES = ['engineer', 'supervisor', 'technician'];
exports.PROJECT_PLANNING_TYPES = ['wbs', 'deliverable', 'schedule'];
exports.PROJECT_PROGRESS_TYPES = ['weekly', 'monthly'];
exports.PROJECT_DOCUMENT_CATEGORIES = [
    'Drawings',
    'BOQ',
    'Reports',
    'Contracts',
    'Approvals',
];
exports.PROJECT_ISSUE_TYPES = ['RFI', 'NCR'];
exports.REPORT_TYPES = [
    'project',
    'certificate',
    'vehicle_assignment',
    'vehicle_inspection',
    'vehicle_maintenance',
    'manpower_allocation',
    'resource_allocation',
    'financial_summary',
];
//# sourceMappingURL=index.js.map