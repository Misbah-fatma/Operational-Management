export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Manager',
  engineer: 'Engineer',
  technician: 'Technician',
  driver: 'Driver',
  viewer: 'Viewer',
};

export const STATUS_COLORS: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  Active: 'success',
  'Expiring Soon': 'warning',
  Expired: 'error',
  Renewed: 'info',
  Archived: 'default',
  Available: 'success',
  Assigned: 'info',
  'Under Maintenance': 'warning',
  'Insurance Expired': 'error',
  'MVPI Expired': 'error',
  Inactive: 'default',
  Overdue: 'error',
  Returned: 'success',
  'Proposal Stage': 'info',
  'Tender Stage': 'info',
  'Under Review': 'warning',
  Awarded: 'success',
  'Planning Stage': 'info',
  'Pending Execution': 'warning',
  'On Hold': 'warning',
  Completed: 'success',
  Closed: 'default',
  Delayed: 'error',
  'On Track': 'success',
  'At Risk': 'warning',
  Ahead: 'info',
  Released: 'default',
};

export const CERTIFICATE_CATEGORIES = [
  'Employee',
  'Equipment',
  'Vehicle',
  'Calibration',
  'Vendor',
  'Project',
];

export const CERTIFICATE_STATUSES = [
  'Active',
  'Expiring Soon',
  'Expired',
  'Renewed',
  'Archived',
];

export const VEHICLE_STATUSES = [
  'Available',
  'Assigned',
  'Under Maintenance',
  'Insurance Expired',
  'MVPI Expired',
  'Inactive',
];

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
export const FUEL_LEVELS = ['Empty', 'Quarter', 'Half', 'Three Quarter', 'Full'];
export const VEHICLE_CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'Damaged'];
export const MAINTENANCE_TYPES = [
  'Insurance Renewal',
  'MVPI Renewal',
  'Service Due',
  'Oil Change',
  'Tyres',
  'Repairs',
];

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
];

export const PROJECT_DOCUMENT_CATEGORIES = [
  'Drawings',
  'BOQ',
  'Reports',
  'Contracts',
  'Approvals',
];

export const REPORT_TYPES = [
  { value: 'project', label: 'Project Report' },
  { value: 'certificate', label: 'Certificate Report' },
  { value: 'vehicle_assignment', label: 'Vehicle Assignment Report' },
  { value: 'vehicle_inspection', label: 'Vehicle Inspection Report' },
  { value: 'vehicle_maintenance', label: 'Vehicle Maintenance Report' },
  { value: 'manpower_allocation', label: 'Manpower Allocation Report' },
  { value: 'resource_allocation', label: 'Resource Allocation Report' },
  { value: 'financial_summary', label: 'Financial Summary Report' },
];

export const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return '-';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

export const formatDate = (date?: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatRole = (role: string) => ROLE_LABELS[role] || role;
