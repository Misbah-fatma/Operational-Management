import {
  Project,
  IProject,
  Milestone,
  IMilestone,
  ProjectPlanningItem,
  IProjectPlanningItem,
  ProjectProgress,
  IProjectProgress,
  ProjectAssignment,
  IProjectAssignment,
  ProjectDocument,
  IProjectDocument,
  ProjectFinancial,
  IProjectFinancial,
  ProjectTeam,
  IProjectTeam,
  User,
  Vehicle,
  Equipment,
} from '../models';
import { ApiError } from '../utils/ApiResponse';
import {
  PaginationOptions,
  PaginatedResult,
  buildPaginationMeta,
  buildSort,
  escapeRegex,
} from '../utils/pagination';
import {
  calculateDelayStatus,
  calculateProjectProgress,
  generateProjectAssignmentId,
} from '../utils/helpers';
import { storageService } from '../utils/storage';
import { PROJECT_STATUSES } from '../constants';

export interface ProjectFilters {
  search?: string;
  status?: string;
  client?: string;
  projectManager?: string;
  startDateFrom?: string;
  startDateTo?: string;
  isArchived?: boolean;
}

export interface CreateProjectInput {
  name: string;
  code?: string;
  client?: string;
  contractNumber?: string;
  contractValue?: number;
  description?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  sla?: string;
  status?: IProject['status'];
  projectManager?: string;
  remarks?: string;
  createdBy: string;
}

export class ProjectService {
  private projectPopulate = [
    { path: 'projectManager', select: 'firstName lastName email employeeId' },
    { path: 'createdBy', select: 'firstName lastName email' },
    { path: 'updatedBy', select: 'firstName lastName email' },
  ];

  private buildFilter(filters: ProjectFilters): Record<string, unknown> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.search) {
      const regex = new RegExp(escapeRegex(filters.search), 'i');
      query.$or = [{ name: regex }, { code: regex }, { client: regex }, { contractNumber: regex }];
    }
    if (filters.status) query.status = filters.status;
    if (filters.client) query.client = new RegExp(escapeRegex(filters.client), 'i');
    if (filters.projectManager) query.projectManager = filters.projectManager;
    if (filters.isArchived !== undefined) query.isArchived = filters.isArchived;

    if (filters.startDateFrom || filters.startDateTo) {
      const startDate: Record<string, Date> = {};
      if (filters.startDateFrom) startDate.$gte = new Date(filters.startDateFrom);
      if (filters.startDateTo) startDate.$lte = new Date(filters.startDateTo);
      query.startDate = startDate;
    }

    return query;
  }

  async getAll(
    filters: ProjectFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<IProject>> {
    const query = this.buildFilter(filters);
    const sort = buildSort(pagination.sortBy || 'createdAt', pagination.sortOrder || 'desc');

    const [data, total] = await Promise.all([
      Project.find(query)
        .populate(this.projectPopulate)
        .sort(sort)
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit),
      Project.countDocuments(query),
    ]);

    return {
      data,
      pagination: buildPaginationMeta(pagination.page, pagination.limit, total),
    };
  }

  async getById(id: string): Promise<IProject> {
    const project = await Project.findOne({ _id: id, isDeleted: false }).populate(
      this.projectPopulate,
    );
    if (!project) throw new ApiError(404, 'Project not found');
    return project;
  }

  async getDetail(id: string) {
    const project = await this.getById(id);
    const [team, milestones, planning, assignments, progress, documents, financial] =
      await Promise.all([
        ProjectTeam.find({ project: id, isDeleted: false })
          .populate('user', 'firstName lastName email role employeeId')
          .sort({ joinedDate: -1 }),
        Milestone.find({ project: id, isDeleted: false }).sort({ plannedDate: 1 }),
        ProjectPlanningItem.find({ project: id, isDeleted: false }).sort({ plannedDate: 1 }),
        ProjectAssignment.find({ project: id, isDeleted: false })
          .populate('employee', 'firstName lastName email role')
          .populate('vehicle', 'vehicleName registrationNumber vehicleId')
          .populate('equipment', 'name equipmentId')
          .sort({ assignmentDate: -1 }),
        ProjectProgress.find({ project: id, isDeleted: false })
          .populate('createdBy', 'firstName lastName')
          .sort({ date: -1 }),
        ProjectDocument.find({ project: id, isDeleted: false })
          .populate('uploadedBy', 'firstName lastName')
          .sort({ createdAt: -1 }),
        ProjectFinancial.findOne({ project: id }),
      ]);

    return { project, team, milestones, planning, assignments, progress, documents, financial };
  }

  async create(input: CreateProjectInput): Promise<IProject> {
    const code = input.code?.toUpperCase() || `PRJ-${Date.now().toString().slice(-6)}`;
    const exists = await Project.findOne({ code, isDeleted: false });
    if (exists) throw new ApiError(400, 'Project code already exists');

    const project = await Project.create({
      ...input,
      code,
      createdBy: input.createdBy,
      updatedBy: input.createdBy,
    });

    await ProjectFinancial.create({
      project: project._id,
      budget: input.budget || 0,
      createdBy: input.createdBy,
      updatedBy: input.createdBy,
    });

    return project.populate(this.projectPopulate);
  }

  async update(id: string, input: Partial<CreateProjectInput>, updatedBy: string): Promise<IProject> {
    const project = await Project.findOne({ _id: id, isDeleted: false });
    if (!project) throw new ApiError(404, 'Project not found');

    Object.assign(project, input, { updatedBy });
    await project.save();

    if (input.budget !== undefined) {
      await ProjectFinancial.findOneAndUpdate(
        { project: id },
        { budget: input.budget, updatedBy },
        { upsert: true },
      );
    }

    await this.recalculateProgress(id);
    return project.populate(this.projectPopulate);
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const project = await Project.findOne({ _id: id, isDeleted: false });
    if (!project) throw new ApiError(404, 'Project not found');
    project.isDeleted = true;
    project.deletedAt = new Date();
    project.deletedBy = deletedBy as unknown as IProject['deletedBy'];
    await project.save();
  }

  async archive(id: string, updatedBy: string): Promise<IProject> {
    const project = await Project.findOne({ _id: id, isDeleted: false });
    if (!project) throw new ApiError(404, 'Project not found');
    project.isArchived = true;
    project.status = 'Closed';
    project.updatedBy = updatedBy as unknown as IProject['updatedBy'];
    await project.save();
    return project.populate(this.projectPopulate);
  }

  async duplicate(id: string, createdBy: string): Promise<IProject> {
    const source = await this.getById(id);
    const newCode = `${source.code}-COPY-${Date.now().toString().slice(-4)}`;
    return this.create({
      name: `${source.name} (Copy)`,
      code: newCode,
      client: source.client,
      contractNumber: source.contractNumber,
      contractValue: source.contractValue,
      description: source.description,
      location: source.location,
      startDate: source.startDate,
      endDate: source.endDate,
      budget: source.budget,
      sla: source.sla,
      status: 'Proposal Stage',
      projectManager: source.projectManager?.toString(),
      remarks: source.remarks,
      createdBy,
    });
  }

  async bulkAction(
    ids: string[],
    action: 'delete' | 'archive',
    userId: string,
  ): Promise<number> {
    let count = 0;
    for (const id of ids) {
      if (action === 'delete') {
        await this.softDelete(id, userId);
      } else {
        await this.archive(id, userId);
      }
      count++;
    }
    return count;
  }

  async recalculateProgress(projectId: string): Promise<void> {
    const [milestones, progressUpdates, project] = await Promise.all([
      Milestone.find({ project: projectId, isDeleted: false }),
      ProjectProgress.find({ project: projectId, isDeleted: false }).sort({ date: -1 }),
      Project.findById(projectId),
    ]);
    if (!project) return;

    const actualProgress = calculateProjectProgress(
      milestones.map((m) => ({ progressPercent: m.progressPercent })),
      progressUpdates.map((p) => ({ progressPercent: p.progressPercent, date: p.date })),
    );

    project.actualProgressPercent = actualProgress;
    project.progressPercent = actualProgress;
    project.delayStatus = calculateDelayStatus(
      project.plannedProgressPercent,
      actualProgress,
    ) as IProject['delayStatus'];
    await project.save();
  }

  // Milestones
  async createMilestone(projectId: string, data: Partial<IMilestone>, userId: string) {
    await this.getById(projectId);
    const milestone = await Milestone.create({
      ...data,
      project: projectId,
      createdBy: userId,
      updatedBy: userId,
    });
    await this.recalculateProgress(projectId);
    return milestone;
  }

  async updateMilestone(projectId: string, milestoneId: string, data: Partial<IMilestone>, userId: string) {
    const milestone = await Milestone.findOne({ _id: milestoneId, project: projectId, isDeleted: false });
    if (!milestone) throw new ApiError(404, 'Milestone not found');
    Object.assign(milestone, data, { updatedBy: userId });
    await milestone.save();
    await this.recalculateProgress(projectId);
    return milestone;
  }

  async deleteMilestone(projectId: string, milestoneId: string, userId: string) {
    const milestone = await Milestone.findOne({ _id: milestoneId, project: projectId, isDeleted: false });
    if (!milestone) throw new ApiError(404, 'Milestone not found');
    milestone.isDeleted = true;
    milestone.updatedBy = userId as unknown as IMilestone['updatedBy'];
    await milestone.save();
    await this.recalculateProgress(projectId);
  }

  // Planning items
  async createPlanningItem(projectId: string, data: Partial<IProjectPlanningItem>, userId: string) {
    await this.getById(projectId);
    return ProjectPlanningItem.create({ ...data, project: projectId, createdBy: userId, updatedBy: userId });
  }

  async updatePlanningItem(
    projectId: string,
    itemId: string,
    data: Partial<IProjectPlanningItem>,
    userId: string,
  ) {
    const item = await ProjectPlanningItem.findOne({ _id: itemId, project: projectId, isDeleted: false });
    if (!item) throw new ApiError(404, 'Planning item not found');
    Object.assign(item, data, { updatedBy: userId });
    await item.save();
    return item;
  }

  async deletePlanningItem(projectId: string, itemId: string, userId: string) {
    const item = await ProjectPlanningItem.findOne({ _id: itemId, project: projectId, isDeleted: false });
    if (!item) throw new ApiError(404, 'Planning item not found');
    item.isDeleted = true;
    item.updatedBy = userId as unknown as IProjectPlanningItem['updatedBy'];
    await item.save();
  }

  // Resource assignments
  async checkResourceConflict(
    resourceType: string,
    resourceId: string,
    excludeAssignmentId?: string,
  ) {
    const query: Record<string, unknown> = {
      isDeleted: false,
      status: 'Active',
      resourceType,
    };
    if (resourceType === 'employee') query.employee = resourceId;
    if (resourceType === 'vehicle') query.vehicle = resourceId;
    if (resourceType === 'equipment') query.equipment = resourceId;
    if (excludeAssignmentId) query._id = { $ne: excludeAssignmentId };

    const conflict = await ProjectAssignment.findOne(query).populate('project', 'name code');
    return conflict;
  }

  async createAssignment(projectId: string, data: Partial<IProjectAssignment>, userId: string) {
    await this.getById(projectId);

    const resourceId =
      data.resourceType === 'employee'
        ? data.employee?.toString()
        : data.resourceType === 'vehicle'
          ? data.vehicle?.toString()
          : data.equipment?.toString();

    if (!resourceId) throw new ApiError(400, 'Resource is required');

    const conflict = await this.checkResourceConflict(data.resourceType!, resourceId);
    if (conflict) {
      const resourceLabel =
        data.resourceType === 'employee'
          ? 'Employee'
          : data.resourceType === 'vehicle'
            ? 'Vehicle'
            : 'Equipment';
      throw new ApiError(
        409,
        `${resourceLabel} is already assigned to project ${(conflict.project as { code?: string }).code || 'another project'}`,
      );
    }

    const assignment = await ProjectAssignment.create({
      ...data,
      assignmentId: generateProjectAssignmentId(),
      project: projectId,
      status: 'Active',
      createdBy: userId,
      updatedBy: userId,
    });

    if (data.resourceType === 'vehicle' && data.vehicle) {
      await Vehicle.findByIdAndUpdate(data.vehicle, {
        assignedProject: projectId,
        currentStatus: 'Assigned',
        updatedBy: userId,
      });
    }

    return assignment.populate([
      { path: 'employee', select: 'firstName lastName email role' },
      { path: 'vehicle', select: 'vehicleName registrationNumber' },
      { path: 'equipment', select: 'name equipmentId' },
    ]);
  }

  async releaseAssignment(projectId: string, assignmentId: string, userId: string, releaseDate?: Date) {
    const assignment = await ProjectAssignment.findOne({
      _id: assignmentId,
      project: projectId,
      isDeleted: false,
    });
    if (!assignment) throw new ApiError(404, 'Assignment not found');

    assignment.status = 'Released';
    assignment.releaseDate = releaseDate || new Date();
    assignment.updatedBy = userId as unknown as IProjectAssignment['updatedBy'];
    await assignment.save();

    if (assignment.resourceType === 'vehicle' && assignment.vehicle) {
      await Vehicle.findByIdAndUpdate(assignment.vehicle, {
        assignedProject: null,
        currentStatus: 'Available',
        updatedBy: userId,
      });
    }

    return assignment;
  }

  async getResourceAllocations(filters: ProjectFilters, pagination: PaginationOptions) {
    const projectQuery = this.buildFilter(filters);
    const projects = await Project.find(projectQuery).select('_id');
    const projectIds = projects.map((p) => p._id);

    const query = { project: { $in: projectIds }, isDeleted: false };
    const sort = buildSort(pagination.sortBy || 'assignmentDate', pagination.sortOrder || 'desc');

    const [data, total] = await Promise.all([
      ProjectAssignment.find(query)
        .populate('project', 'name code client status')
        .populate('employee', 'firstName lastName email role')
        .populate('vehicle', 'vehicleName registrationNumber vehicleId')
        .populate('equipment', 'name equipmentId')
        .sort(sort)
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit),
      ProjectAssignment.countDocuments(query),
    ]);

    return { data, pagination: buildPaginationMeta(pagination.page, pagination.limit, total) };
  }

  // Progress
  async createProgress(
    projectId: string,
    data: Partial<IProjectProgress>,
    userId: string,
    files?: Express.Multer.File[],
  ) {
    await this.getById(projectId);
    const attachments = files
      ? await Promise.all(files.map((f) => storageService.storeFile(f, 'projects')))
      : [];

    const progress = await ProjectProgress.create({
      ...data,
      project: projectId,
      attachments,
      createdBy: userId,
      updatedBy: userId,
    });

    const project = await Project.findById(projectId);
    if (project && data.progressPercent !== undefined) {
      project.actualProgressPercent = data.progressPercent;
      project.progressPercent = data.progressPercent;
      project.delayStatus = calculateDelayStatus(
        project.plannedProgressPercent,
        data.progressPercent,
      ) as IProject['delayStatus'];
      await project.save();
    }

    await this.recalculateProgress(projectId);
    return progress.populate('createdBy', 'firstName lastName');
  }

  // Documents
  async createDocument(
    projectId: string,
    data: { category: IProjectDocument['category']; fileName: string; version?: string; notes?: string },
    file: Express.Multer.File,
    userId: string,
  ) {
    await this.getById(projectId);
    const stored = await storageService.storeFile(file, 'projects');
    return ProjectDocument.create({
      project: projectId,
      category: data.category,
      fileName: data.fileName || file.originalname,
      version: data.version || '1.0',
      notes: data.notes,
      file: stored,
      uploadedBy: userId,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async replaceDocument(
    projectId: string,
    docId: string,
    file: Express.Multer.File,
    version: string,
    userId: string,
  ) {
    const doc = await ProjectDocument.findOne({ _id: docId, project: projectId, isDeleted: false });
    if (!doc) throw new ApiError(404, 'Document not found');

    if (doc.file?.path) await storageService.deleteFile(doc.file.path);
    const stored = await storageService.storeFile(file, 'projects');
    doc.file = stored;
    doc.version = version;
    doc.updatedBy = userId as unknown as IProjectDocument['updatedBy'];
    await doc.save();
    return doc;
  }

  async deleteDocument(projectId: string, docId: string, userId: string) {
    const doc = await ProjectDocument.findOne({ _id: docId, project: projectId, isDeleted: false });
    if (!doc) throw new ApiError(404, 'Document not found');
    doc.isDeleted = true;
    doc.updatedBy = userId as unknown as IProjectDocument['updatedBy'];
    await doc.save();
  }

  // Financials
  async updateFinancials(projectId: string, data: Partial<IProjectFinancial>, userId: string) {
    await this.getById(projectId);
    const financial = await ProjectFinancial.findOneAndUpdate(
      { project: projectId },
      { ...data, updatedBy: userId },
      { upsert: true, new: true },
    );

    if (data.actualCost !== undefined) {
      await Project.findByIdAndUpdate(projectId, { actualCost: data.actualCost, updatedBy: userId });
    }

    return financial;
  }

  getFinancialSummary(financial: IProjectFinancial | null, project: IProject) {
    const budget = financial?.budget ?? project.budget ?? 0;
    const actualCost = financial?.actualCost ?? project.actualCost ?? 0;
    const budgetUsedPercent = budget > 0 ? Math.round((actualCost / budget) * 100) : 0;
    const remainingBudget = budget - actualCost;
    const costVariance = budget - actualCost;
    const outstandingPayments = financial?.outstandingPayments ?? 0;

    return {
      budget,
      actualCost,
      budgetUsedPercent,
      remainingBudget,
      costVariance,
      outstandingPayments,
      invoices: financial?.invoices ?? [],
    };
  }

  // Team
  async addTeamMember(projectId: string, data: Partial<IProjectTeam>, userId: string) {
    await this.getById(projectId);
    const user = await User.findById(data.user);
    if (!user) throw new ApiError(404, 'User not found');
    return ProjectTeam.create({
      ...data,
      project: projectId,
      joinedDate: data.joinedDate || new Date(),
      status: 'Active',
      createdBy: userId,
      updatedBy: userId,
    }).then((t) => t.populate('user', 'firstName lastName email role employeeId'));
  }

  async removeTeamMember(projectId: string, teamId: string, userId: string) {
    const member = await ProjectTeam.findOne({ _id: teamId, project: projectId, isDeleted: false });
    if (!member) throw new ApiError(404, 'Team member not found');
    member.status = 'Inactive';
    member.leftDate = new Date();
    member.isDeleted = true;
    member.updatedBy = userId as unknown as IProjectTeam['updatedBy'];
    await member.save();
  }

  async getDashboardStats() {
    const baseFilter = { isDeleted: false, isArchived: false };

    const [
      total,
      active,
      proposal,
      planning,
      pendingExecution,
      completed,
      delayed,
      byStatus,
      resourceSummary,
      monthlyProgress,
      timeline,
    ] = await Promise.all([
      Project.countDocuments(baseFilter),
      Project.countDocuments({ ...baseFilter, status: 'Active' }),
      Project.countDocuments({ ...baseFilter, status: 'Proposal Stage' }),
      Project.countDocuments({ ...baseFilter, status: 'Planning Stage' }),
      Project.countDocuments({ ...baseFilter, status: 'Pending Execution' }),
      Project.countDocuments({ ...baseFilter, status: { $in: ['Completed', 'Closed'] } }),
      Project.countDocuments({ ...baseFilter, delayStatus: 'Delayed' }),
      Project.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      ProjectAssignment.aggregate([
        { $match: { isDeleted: false, status: 'Active' } },
        { $group: { _id: '$resourceType', count: { $sum: 1 } } },
      ]),
      ProjectProgress.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
            avgProgress: { $avg: '$progressPercent' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
      Project.find(baseFilter)
        .select('name code status startDate endDate progressPercent delayStatus')
        .sort({ startDate: 1 })
        .limit(20),
    ]);

    const [employeeCount, vehicleCount, equipmentCount] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Vehicle.countDocuments({ isDeleted: false }),
      Equipment.countDocuments({ isDeleted: false }),
    ]);

    const activeAssignments = await ProjectAssignment.countDocuments({
      isDeleted: false,
      status: 'Active',
    });

    const vehicleAssignments = resourceSummary.find((r) => r._id === 'vehicle')?.count || 0;
    const employeeAssignments = resourceSummary.find((r) => r._id === 'employee')?.count || 0;

    const overallProgressAgg = await Project.aggregate([
      { $match: baseFilter },
      { $group: { _id: null, avg: { $avg: '$progressPercent' } } },
    ]);

    return {
      total,
      active,
      proposalStage: proposal,
      planningStage: planning,
      pendingExecution,
      completed,
      delayed,
      overallProgress: Math.round(overallProgressAgg[0]?.avg || 0),
      byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })),
      resourceAllocation: resourceSummary.map((r) => ({
        resourceType: r._id,
        count: r.count,
      })),
      manpowerUtilization:
        employeeCount > 0 ? Math.round((employeeAssignments / employeeCount) * 100) : 0,
      vehicleAllocation:
        vehicleCount > 0 ? Math.round((vehicleAssignments / vehicleCount) * 100) : 0,
      monthlyProgress: monthlyProgress.map((m) => ({
        month: m._id,
        avgProgress: Math.round(m.avgProgress),
        count: m.count,
      })),
      timeline,
      totals: { employees: employeeCount, vehicles: vehicleCount, equipment: equipmentCount },
      activeAssignments,
    };
  }

  async getExportData(filters: ProjectFilters) {
    const query = this.buildFilter(filters);
    return Project.find(query).populate(this.projectPopulate).sort({ createdAt: -1 });
  }
}

export const projectService = new ProjectService();
