export type Role =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'engineer'
  | 'technician'
  | 'driver'
  | 'viewer';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone?: string;
  department?: string;
  employeeId?: string;
  isActive: boolean;
  fullName?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    pagination?: PaginationMeta;
  };
  errors?: string[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Certificate {
  _id: string;
  certificateId: string;
  certificateNumber: string;
  certificateName: string;
  category: string;
  relatedEmployee?: User;
  relatedEquipment?: { _id: string; name: string; equipmentId: string };
  relatedVehicle?: { _id: string; vehicleName: string; registrationNumber: string };
  relatedProject?: { _id: string; name: string; code: string };
  issueDate: string;
  expiryDate: string;
  renewalDate?: string;
  issuingAuthority: string;
  status: string;
  certificateFile?: {
    filename: string;
    originalName: string;
    mimetype?: string;
    url: string;
  };
  remarks?: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  _id: string;
  vehicleId: string;
  vehicleName: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  insuranceNumber?: string;
  insuranceExpiryDate?: string;
  mvpiExpiryDate?: string;
  currentKm: number;
  fuelType: string;
  currentStatus: string;
  assignedProject?: { _id: string; name: string; code: string };
  assignedEmployee?: User;
  remarks?: string;
  createdAt: string;
}

export interface VehicleAssignment {
  _id: string;
  assignmentId: string;
  vehicle: Vehicle;
  assignedTo: User;
  project?: { _id: string; name: string; code: string };
  assignmentDate: string;
  expectedReturnDate?: string;
  assignedBy: User;
  startingKm: number;
  fuelLevel: string;
  notes?: string;
  preAssignmentPhotos: { url: string; type: string }[];
  status: 'Active' | 'Returned' | 'Overdue';
  returnDetails?: {
    returnDate: string;
    finalKm: number;
    fuelLevel: string;
    vehicleCondition: string;
    remarks?: string;
  };
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface CertificateDashboard {
  total: number;
  active: number;
  expired: number;
  expiringWithin7Days: number;
  expiringWithin30Days: number;
  byCategory: { category: string; count: number }[];
  byStatus: { status: string; count: number }[];
  upcomingRenewals: Certificate[];
  recentlyAdded: Certificate[];
}

export interface VehicleMaintenance {
  _id: string;
  vehicle: string;
  maintenanceType: string;
  description: string;
  scheduledDate?: string;
  completedDate?: string;
  cost: number;
  nextDueDate?: string;
  notes?: string;
}

export interface FleetDashboard {
  total: number;
  available: number;
  assigned: number;
  underMaintenance: number;
  insuranceExpiringSoon: number;
  mvpiExpiringSoon: number;
  utilization: number;
  statusBreakdown: { status: string; count: number }[];
  kmUsageSummary: { totalKm: number; avgKm: number; maxKm: number };
  activeAssignments: VehicleAssignment[];
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: string | number | boolean | undefined;
}

export interface Project {
  _id: string;
  name: string;
  code: string;
  client?: string;
  contractNumber?: string;
  contractValue?: number;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  sla?: string;
  status: string;
  progressPercent: number;
  plannedProgressPercent?: number;
  actualProgressPercent?: number;
  delayStatus?: string;
  projectManager?: User;
  remarks?: string;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  _id: string;
  project: string;
  name: string;
  description?: string;
  plannedDate?: string;
  actualDate?: string;
  status: string;
  progressPercent: number;
}

export interface ProjectPlanningItem {
  _id: string;
  project: string;
  type: 'wbs' | 'deliverable' | 'schedule';
  name: string;
  description?: string;
  plannedDate?: string;
  actualDate?: string;
  status: string;
  progressPercent: number;
}

export interface ProjectAssignment {
  _id: string;
  assignmentId: string;
  project: Project | string;
  resourceType: 'employee' | 'vehicle' | 'equipment';
  employee?: User;
  vehicle?: Vehicle;
  equipment?: { _id: string; name: string; equipmentId: string };
  employeeRole?: string;
  workPackage?: string;
  assignmentDate: string;
  releaseDate?: string;
  status: string;
  remarks?: string;
}

export interface ProjectProgress {
  _id: string;
  project: string;
  updateType: 'weekly' | 'monthly';
  date: string;
  progressPercent: number;
  summary?: string;
  issues?: string;
  createdBy?: User;
}

export interface ProjectDocument {
  _id: string;
  project: string;
  category: string;
  fileName: string;
  version: string;
  notes?: string;
  file: { url: string; originalName: string; mimetype?: string };
  uploadedBy?: User;
  createdAt: string;
}

export interface ProjectFinancial {
  budget: number;
  actualCost: number;
  budgetUsedPercent: number;
  remainingBudget: number;
  costVariance: number;
  outstandingPayments: number;
  invoices: { invoiceNumber: string; amount: number; date: string; status: string }[];
}

export interface ProjectDetail {
  project: Project;
  team: { _id: string; user: User; role: string; status: string; joinedDate: string }[];
  milestones: Milestone[];
  planning: ProjectPlanningItem[];
  assignments: ProjectAssignment[];
  progress: ProjectProgress[];
  documents: ProjectDocument[];
  financial: ProjectFinancial | null;
  financialSummary: ProjectFinancial;
}

export interface ProjectDashboard {
  total: number;
  active: number;
  proposalStage: number;
  planningStage: number;
  pendingExecution: number;
  completed: number;
  delayed: number;
  overallProgress: number;
  byStatus: { status: string; count: number }[];
  resourceAllocation: { resourceType: string; count: number }[];
  manpowerUtilization: number;
  vehicleAllocation: number;
  monthlyProgress: { month: string; avgProgress: number; count: number }[];
  timeline: Project[];
  activeAssignments?: number;
}

export interface ExecutiveDashboard {
  projects: {
    total: number;
    active: number;
    completed: number;
    delayed: number;
    proposal: number;
    planning: number;
    pendingExecution: number;
    byStatus: { status: string; count: number }[];
    overallProgress: number;
  };
  employees: { total: number };
  vehicles: { total: number; assigned: number; available: number; utilization: number };
  certificates: {
    total: number;
    expiringSoon: number;
    expired: number;
    byStatus: { status: string; count: number }[];
  };
  openRFIs: number;
  openNCRs: number;
  pendingApprovals: number;
  outstandingPayments: number;
  charts: {
    projectStatusDistribution: { status: string; count: number }[];
    monthlyProjectProgress: { month: string; progress: number }[];
    manpowerAllocation: { role: string; count: number }[];
    vehicleUtilization: { status: string; count: number }[];
    certificateExpiry: { label: string; count: number }[];
    projectHealth: { status: string; count: number; avgProgress: number }[];
    costVsBudget: { name: string; code: string; budget: number; actualCost: number; variance: number }[];
    resourceAllocation: { resourceType: string; count: number }[];
  };
}

export interface ReportResult {
  title: string;
  columns: string[];
  rows: string[][];
}
