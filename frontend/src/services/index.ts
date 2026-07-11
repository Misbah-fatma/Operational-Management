import api from './api';
import {
  ApiResponse,
  User,
  QueryParams,
  Certificate,
  CertificateDashboard,
  Vehicle,
  VehicleAssignment,
  FleetDashboard,
  Notification,
  Project,
  ProjectDetail,
  ProjectDashboard,
  ExecutiveDashboard,
  ReportResult,
  Milestone,
  ProjectPlanningItem,
  ProjectAssignment,
  ProjectProgress,
  ProjectDocument,
} from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', { email, password }),
  getProfile: () => api.get<ApiResponse<User>>('/auth/profile'),
  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'department'>>) =>
    api.put<ApiResponse<User>>('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put<ApiResponse>('/auth/change-password', { currentPassword, newPassword }),
  getUsers: (params?: QueryParams) => api.get<ApiResponse<User[]>>('/auth/users', { params }),
};

export const certificateApi = {
  getAll: (params?: QueryParams) =>
    api.get<ApiResponse<Certificate[]>>('/certificates', { params }),
  getById: (id: string) => api.get<ApiResponse<Certificate>>(`/certificates/${id}`),
  create: (data: FormData) =>
    api.post<ApiResponse<Certificate>>('/certificates', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, data: FormData) =>
    api.put<ApiResponse<Certificate>>(`/certificates/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete<ApiResponse>(`/certificates/${id}`),
  download: (id: string) =>
    api.get(`/certificates/${id}/download`, { responseType: 'blob' }),
  getDashboard: () => api.get<ApiResponse<CertificateDashboard>>('/certificates/dashboard'),
  exportExcel: (params?: QueryParams) =>
    api.get('/certificates/export/excel', { params, responseType: 'blob' }),
  exportPdf: (params?: QueryParams) =>
    api.get('/certificates/export/pdf', { params, responseType: 'blob' }),
};

export const vehicleApi = {
  getAll: (params?: QueryParams) => api.get<ApiResponse<Vehicle[]>>('/vehicles', { params }),
  getById: (id: string) => api.get<ApiResponse<Vehicle>>(`/vehicles/${id}`),
  create: (data: Partial<Vehicle>) => api.post<ApiResponse<Vehicle>>('/vehicles', data),
  update: (id: string, data: Partial<Vehicle>) =>
    api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/vehicles/${id}`),
  getDashboard: () => api.get<ApiResponse<FleetDashboard>>('/vehicles/dashboard'),
  exportExcel: (params?: QueryParams) =>
    api.get('/vehicles/export/excel', { params, responseType: 'blob' }),
  exportPdf: (params?: QueryParams) =>
    api.get('/vehicles/export/pdf', { params, responseType: 'blob' }),
  getAssignments: (params?: QueryParams) =>
    api.get<ApiResponse<VehicleAssignment[]>>('/vehicles/assignments/list', { params }),
  createAssignment: (data: FormData) =>
    api.post<ApiResponse<VehicleAssignment>>('/vehicles/assignments', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateAssignment: (id: string, data: Record<string, unknown>) =>
    api.put<ApiResponse<VehicleAssignment>>(`/vehicles/assignments/${id}`, data),
  deleteAssignment: (id: string) => api.delete<ApiResponse>(`/vehicles/assignments/${id}`),
  returnVehicle: (id: string, data: FormData) =>
    api.post<ApiResponse<VehicleAssignment>>(`/vehicles/assignments/${id}/return`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  createMaintenance: (data: Record<string, unknown>) =>
    api.post('/vehicles/maintenance', data),
  getMaintenanceHistory: (vehicleId: string, params?: QueryParams) =>
    api.get(`/vehicles/${vehicleId}/maintenance`, { params }),
};

export const notificationApi = {
  getAll: (params?: QueryParams) =>
    api.get<ApiResponse<Notification[]>>('/notifications', { params }),
  getUnreadCount: () => api.get<ApiResponse<{ count: number }>>('/notifications/unread-count'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export const projectApi = {
  getAll: (params?: QueryParams) => api.get<ApiResponse<Project[]>>('/projects', { params }),
  getById: (id: string) => api.get<ApiResponse<Project>>(`/projects/${id}`),
  getDetail: (id: string) => api.get<ApiResponse<ProjectDetail>>(`/projects/${id}/detail`),
  create: (data: Partial<Project>) => api.post<ApiResponse<Project>>('/projects', data),
  update: (id: string, data: Partial<Project>) => api.put<ApiResponse<Project>>(`/projects/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse>(`/projects/${id}`),
  archive: (id: string) => api.patch<ApiResponse<Project>>(`/projects/${id}/archive`),
  duplicate: (id: string) => api.post<ApiResponse<Project>>(`/projects/${id}/duplicate`),
  bulkAction: (ids: string[], action: 'delete' | 'archive') =>
    api.post<ApiResponse>('/projects/bulk', { ids, action }),
  getDashboard: () => api.get<ApiResponse<ProjectDashboard>>('/projects/dashboard'),
  getResourceAllocations: (params?: QueryParams) =>
    api.get<ApiResponse<ProjectAssignment[]>>('/projects/resource-allocations', { params }),
  checkResourceConflict: (resourceType: string, resourceId: string) =>
    api.get<ApiResponse<{ hasConflict: boolean }>>('/projects/resource-allocations/check', {
      params: { resourceType, resourceId },
    }),
  exportExcel: (params?: QueryParams) =>
    api.get('/projects/export/excel', { params, responseType: 'blob' }),
  exportPdf: (params?: QueryParams) =>
    api.get('/projects/export/pdf', { params, responseType: 'blob' }),
  createMilestone: (projectId: string, data: Partial<Milestone>) =>
    api.post<ApiResponse<Milestone>>(`/projects/${projectId}/milestones`, data),
  updateMilestone: (projectId: string, milestoneId: string, data: Partial<Milestone>) =>
    api.put<ApiResponse<Milestone>>(`/projects/${projectId}/milestones/${milestoneId}`, data),
  deleteMilestone: (projectId: string, milestoneId: string) =>
    api.delete<ApiResponse>(`/projects/${projectId}/milestones/${milestoneId}`),
  createPlanningItem: (projectId: string, data: Partial<ProjectPlanningItem>) =>
    api.post<ApiResponse<ProjectPlanningItem>>(`/projects/${projectId}/planning`, data),
  deletePlanningItem: (projectId: string, itemId: string) =>
    api.delete<ApiResponse>(`/projects/${projectId}/planning/${itemId}`),
  createAssignment: (projectId: string, data: Record<string, unknown>) =>
    api.post<ApiResponse<ProjectAssignment>>(`/projects/${projectId}/assignments`, data),
  releaseAssignment: (projectId: string, assignmentId: string) =>
    api.patch<ApiResponse>(`/projects/${projectId}/assignments/${assignmentId}/release`),
  createProgress: (projectId: string, data: FormData) =>
    api.post<ApiResponse<ProjectProgress>>(`/projects/${projectId}/progress`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadDocument: (projectId: string, data: FormData) =>
    api.post<ApiResponse<ProjectDocument>>(`/projects/${projectId}/documents`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteDocument: (projectId: string, docId: string) =>
    api.delete<ApiResponse>(`/projects/${projectId}/documents/${docId}`),
  downloadDocument: (projectId: string, docId: string) =>
    api.get(`/projects/${projectId}/documents/${docId}/download`, { responseType: 'blob' }),
  updateFinancials: (projectId: string, data: Record<string, unknown>) =>
    api.put<ApiResponse>(`/projects/${projectId}/financials`, data),
  addTeamMember: (projectId: string, data: Record<string, unknown>) =>
    api.post<ApiResponse>(`/projects/${projectId}/team`, data),
  removeTeamMember: (projectId: string, teamId: string) =>
    api.delete<ApiResponse>(`/projects/${projectId}/team/${teamId}`),
};

export const executiveApi = {
  getDashboard: () => api.get<ApiResponse<ExecutiveDashboard>>('/executive/dashboard'),
};

export const reportApi = {
  getTypes: () => api.get<ApiResponse<string[]>>('/reports/types'),
  generate: (params: QueryParams) => api.get<ApiResponse<ReportResult>>('/reports/generate', { params }),
  exportExcel: (params: QueryParams) =>
    api.get('/reports/export/excel', { params, responseType: 'blob' }),
  exportPdf: (params: QueryParams) =>
    api.get('/reports/export/pdf', { params, responseType: 'blob' }),
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
