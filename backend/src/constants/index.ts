export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  ENGINEER: 'engineer',
  TECHNICIAN: 'technician',
  DRIVER: 'driver',
  VIEWER: 'viewer',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES = Object.values(ROLES);

export const PERMISSIONS = {
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
  ASSIGNMENTS_DELETE: 'assignments:delete',

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
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: ALL_PERMISSIONS,

  [ROLES.ADMIN]: ALL_PERMISSIONS.filter((p) => p !== PERMISSIONS.USERS_DELETE),

  [ROLES.MANAGER]: [
    PERMISSIONS.USERS_READ,
    PERMISSIONS.CERTIFICATES_READ,
    PERMISSIONS.CERTIFICATES_CREATE,
    PERMISSIONS.CERTIFICATES_UPDATE,
    PERMISSIONS.CERTIFICATES_DELETE,
    PERMISSIONS.CERTIFICATES_EXPORT,
    PERMISSIONS.VEHICLES_READ,
    PERMISSIONS.VEHICLES_CREATE,
    PERMISSIONS.VEHICLES_UPDATE,
    PERMISSIONS.VEHICLES_DELETE,
    PERMISSIONS.VEHICLES_EXPORT,
    PERMISSIONS.ASSIGNMENTS_READ,
    PERMISSIONS.ASSIGNMENTS_CREATE,
    PERMISSIONS.ASSIGNMENTS_UPDATE,
    PERMISSIONS.ASSIGNMENTS_RETURN,
    PERMISSIONS.ASSIGNMENTS_DELETE,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.MAINTENANCE_CREATE,
    PERMISSIONS.MAINTENANCE_UPDATE,
    PERMISSIONS.NOTIFICATIONS_READ,
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.PROJECTS_CREATE,
    PERMISSIONS.PROJECTS_UPDATE,
    PERMISSIONS.PROJECTS_DELETE,
    PERMISSIONS.PROJECTS_EXPORT,
    PERMISSIONS.PROJECTS_ARCHIVE,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.REPORTS_EXPORT,
  ],

  [ROLES.ENGINEER]: [
    PERMISSIONS.CERTIFICATES_READ,
    PERMISSIONS.CERTIFICATES_EXPORT,
    PERMISSIONS.VEHICLES_READ,
    PERMISSIONS.ASSIGNMENTS_READ,
    PERMISSIONS.ASSIGNMENTS_CREATE,
    PERMISSIONS.ASSIGNMENTS_UPDATE,
    PERMISSIONS.ASSIGNMENTS_RETURN,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.NOTIFICATIONS_READ,
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.PROJECTS_UPDATE,
    PERMISSIONS.REPORTS_READ,
  ],

  [ROLES.TECHNICIAN]: [
    PERMISSIONS.CERTIFICATES_READ,
    PERMISSIONS.VEHICLES_READ,
    PERMISSIONS.ASSIGNMENTS_READ,
    PERMISSIONS.ASSIGNMENTS_RETURN,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.NOTIFICATIONS_READ,
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.REPORTS_READ,
  ],

  [ROLES.DRIVER]: [
    PERMISSIONS.VEHICLES_READ,
    PERMISSIONS.ASSIGNMENTS_READ,
    PERMISSIONS.ASSIGNMENTS_RETURN,
    PERMISSIONS.NOTIFICATIONS_READ,
  ],

  [ROLES.VIEWER]: [
    PERMISSIONS.CERTIFICATES_READ,
    PERMISSIONS.CERTIFICATES_EXPORT,
    PERMISSIONS.VEHICLES_READ,
    PERMISSIONS.ASSIGNMENTS_READ,
    PERMISSIONS.MAINTENANCE_READ,
    PERMISSIONS.NOTIFICATIONS_READ,
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.PROJECTS_EXPORT,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.REPORTS_EXPORT,
  ],
};

export const ASSIGNABLE_ROLES: Role[] = [
  ROLES.ENGINEER,
  ROLES.TECHNICIAN,
  ROLES.DRIVER,
];

export const CERTIFICATE_CATEGORIES = [
  'Employee',
  'Equipment',
  'Vehicle',
  'Calibration',
  'Vendor',
  'Project',
] as const;

export const CERTIFICATE_STATUSES = [
  'Active',
  'Expiring Soon',
  'Expired',
  'Renewed',
  'Archived',
] as const;

export const VEHICLE_STATUSES = [
  'Available',
  'Assigned',
  'Under Maintenance',
  'Insurance Expired',
  'MVPI Expired',
  'Inactive',
] as const;

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'] as const;

export const MAINTENANCE_TYPES = [
  'Insurance Renewal',
  'MVPI Renewal',
  'Service Due',
  'Oil Change',
  'Tyres',
  'Repairs',
] as const;

export const VEHICLE_CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'] as const;

export const FUEL_LEVELS = ['Empty', 'Quarter', 'Half', 'Three Quarter', 'Full'] as const;

export const PROJECT_STATUSES = [
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
] as const;

export const PROJECT_DELAY_STATUSES = ['On Track', 'Delayed', 'At Risk', 'Ahead'] as const;

export const PROJECT_RESOURCE_TYPES = ['employee', 'vehicle', 'equipment'] as const;

export const PROJECT_ASSIGNMENT_STATUSES = ['Active', 'Released', 'Completed'] as const;

export const PROJECT_EMPLOYEE_ROLES = ['engineer', 'supervisor', 'technician'] as const;

export const PROJECT_PLANNING_TYPES = ['wbs', 'deliverable', 'schedule'] as const;

export const PROJECT_PROGRESS_TYPES = ['weekly', 'monthly'] as const;

export const PROJECT_DOCUMENT_CATEGORIES = [
  'Drawings',
  'BOQ',
  'Reports',
  'Contracts',
  'Approvals',
] as const;

export const PROJECT_ISSUE_TYPES = ['RFI', 'NCR'] as const;

export const REPORT_TYPES = [
  'project',
  'certificate',
  'vehicle_assignment',
  'vehicle_inspection',
  'vehicle_maintenance',
  'manpower_allocation',
  'resource_allocation',
  'financial_summary',
] as const;
