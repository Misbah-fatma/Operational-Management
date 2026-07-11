"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = exports.ProjectService = void 0;
const models_1 = require("../models");
const ApiResponse_1 = require("../utils/ApiResponse");
const pagination_1 = require("../utils/pagination");
const helpers_1 = require("../utils/helpers");
const storage_1 = require("../utils/storage");
class ProjectService {
    constructor() {
        this.projectPopulate = [
            { path: 'projectManager', select: 'firstName lastName email employeeId' },
            { path: 'createdBy', select: 'firstName lastName email' },
            { path: 'updatedBy', select: 'firstName lastName email' },
        ];
    }
    buildFilter(filters) {
        const query = { isDeleted: false };
        if (filters.search) {
            const regex = new RegExp((0, pagination_1.escapeRegex)(filters.search), 'i');
            query.$or = [{ name: regex }, { code: regex }, { client: regex }, { contractNumber: regex }];
        }
        if (filters.status)
            query.status = filters.status;
        if (filters.client)
            query.client = new RegExp((0, pagination_1.escapeRegex)(filters.client), 'i');
        if (filters.projectManager)
            query.projectManager = filters.projectManager;
        if (filters.isArchived !== undefined)
            query.isArchived = filters.isArchived;
        if (filters.startDateFrom || filters.startDateTo) {
            const startDate = {};
            if (filters.startDateFrom)
                startDate.$gte = new Date(filters.startDateFrom);
            if (filters.startDateTo)
                startDate.$lte = new Date(filters.startDateTo);
            query.startDate = startDate;
        }
        return query;
    }
    async getAll(filters, pagination) {
        const query = this.buildFilter(filters);
        const sort = (0, pagination_1.buildSort)(pagination.sortBy || 'createdAt', pagination.sortOrder || 'desc');
        const [data, total] = await Promise.all([
            models_1.Project.find(query)
                .populate(this.projectPopulate)
                .sort(sort)
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit),
            models_1.Project.countDocuments(query),
        ]);
        return {
            data,
            pagination: (0, pagination_1.buildPaginationMeta)(pagination.page, pagination.limit, total),
        };
    }
    async getById(id) {
        const project = await models_1.Project.findOne({ _id: id, isDeleted: false }).populate(this.projectPopulate);
        if (!project)
            throw new ApiResponse_1.ApiError(404, 'Project not found');
        return project;
    }
    async getDetail(id) {
        const project = await this.getById(id);
        const [team, milestones, planning, assignments, progress, documents, financial] = await Promise.all([
            models_1.ProjectTeam.find({ project: id, isDeleted: false })
                .populate('user', 'firstName lastName email role employeeId')
                .sort({ joinedDate: -1 }),
            models_1.Milestone.find({ project: id, isDeleted: false }).sort({ plannedDate: 1 }),
            models_1.ProjectPlanningItem.find({ project: id, isDeleted: false }).sort({ plannedDate: 1 }),
            models_1.ProjectAssignment.find({ project: id, isDeleted: false })
                .populate('employee', 'firstName lastName email role')
                .populate('vehicle', 'vehicleName registrationNumber vehicleId')
                .populate('equipment', 'name equipmentId')
                .sort({ assignmentDate: -1 }),
            models_1.ProjectProgress.find({ project: id, isDeleted: false })
                .populate('createdBy', 'firstName lastName')
                .sort({ date: -1 }),
            models_1.ProjectDocument.find({ project: id, isDeleted: false })
                .populate('uploadedBy', 'firstName lastName')
                .sort({ createdAt: -1 }),
            models_1.ProjectFinancial.findOne({ project: id }),
        ]);
        return { project, team, milestones, planning, assignments, progress, documents, financial };
    }
    async create(input) {
        const code = input.code?.toUpperCase() || `PRJ-${Date.now().toString().slice(-6)}`;
        const exists = await models_1.Project.findOne({ code, isDeleted: false });
        if (exists)
            throw new ApiResponse_1.ApiError(400, 'Project code already exists');
        const project = await models_1.Project.create({
            ...input,
            code,
            createdBy: input.createdBy,
            updatedBy: input.createdBy,
        });
        await models_1.ProjectFinancial.create({
            project: project._id,
            budget: input.budget || 0,
            createdBy: input.createdBy,
            updatedBy: input.createdBy,
        });
        return project.populate(this.projectPopulate);
    }
    async update(id, input, updatedBy) {
        const project = await models_1.Project.findOne({ _id: id, isDeleted: false });
        if (!project)
            throw new ApiResponse_1.ApiError(404, 'Project not found');
        Object.assign(project, input, { updatedBy });
        await project.save();
        if (input.budget !== undefined) {
            await models_1.ProjectFinancial.findOneAndUpdate({ project: id }, { budget: input.budget, updatedBy }, { upsert: true });
        }
        await this.recalculateProgress(id);
        return project.populate(this.projectPopulate);
    }
    async softDelete(id, deletedBy) {
        const project = await models_1.Project.findOne({ _id: id, isDeleted: false });
        if (!project)
            throw new ApiResponse_1.ApiError(404, 'Project not found');
        project.isDeleted = true;
        project.deletedAt = new Date();
        project.deletedBy = deletedBy;
        await project.save();
    }
    async archive(id, updatedBy) {
        const project = await models_1.Project.findOne({ _id: id, isDeleted: false });
        if (!project)
            throw new ApiResponse_1.ApiError(404, 'Project not found');
        project.isArchived = true;
        project.status = 'Closed';
        project.updatedBy = updatedBy;
        await project.save();
        return project.populate(this.projectPopulate);
    }
    async duplicate(id, createdBy) {
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
    async bulkAction(ids, action, userId) {
        let count = 0;
        for (const id of ids) {
            if (action === 'delete') {
                await this.softDelete(id, userId);
            }
            else {
                await this.archive(id, userId);
            }
            count++;
        }
        return count;
    }
    async recalculateProgress(projectId) {
        const [milestones, progressUpdates, project] = await Promise.all([
            models_1.Milestone.find({ project: projectId, isDeleted: false }),
            models_1.ProjectProgress.find({ project: projectId, isDeleted: false }).sort({ date: -1 }),
            models_1.Project.findById(projectId),
        ]);
        if (!project)
            return;
        const actualProgress = (0, helpers_1.calculateProjectProgress)(milestones.map((m) => ({ progressPercent: m.progressPercent })), progressUpdates.map((p) => ({ progressPercent: p.progressPercent, date: p.date })));
        project.actualProgressPercent = actualProgress;
        project.progressPercent = actualProgress;
        project.delayStatus = (0, helpers_1.calculateDelayStatus)(project.plannedProgressPercent, actualProgress);
        await project.save();
    }
    // Milestones
    async createMilestone(projectId, data, userId) {
        await this.getById(projectId);
        const milestone = await models_1.Milestone.create({
            ...data,
            project: projectId,
            createdBy: userId,
            updatedBy: userId,
        });
        await this.recalculateProgress(projectId);
        return milestone;
    }
    async updateMilestone(projectId, milestoneId, data, userId) {
        const milestone = await models_1.Milestone.findOne({ _id: milestoneId, project: projectId, isDeleted: false });
        if (!milestone)
            throw new ApiResponse_1.ApiError(404, 'Milestone not found');
        Object.assign(milestone, data, { updatedBy: userId });
        await milestone.save();
        await this.recalculateProgress(projectId);
        return milestone;
    }
    async deleteMilestone(projectId, milestoneId, userId) {
        const milestone = await models_1.Milestone.findOne({ _id: milestoneId, project: projectId, isDeleted: false });
        if (!milestone)
            throw new ApiResponse_1.ApiError(404, 'Milestone not found');
        milestone.isDeleted = true;
        milestone.updatedBy = userId;
        await milestone.save();
        await this.recalculateProgress(projectId);
    }
    // Planning items
    async createPlanningItem(projectId, data, userId) {
        await this.getById(projectId);
        return models_1.ProjectPlanningItem.create({ ...data, project: projectId, createdBy: userId, updatedBy: userId });
    }
    async updatePlanningItem(projectId, itemId, data, userId) {
        const item = await models_1.ProjectPlanningItem.findOne({ _id: itemId, project: projectId, isDeleted: false });
        if (!item)
            throw new ApiResponse_1.ApiError(404, 'Planning item not found');
        Object.assign(item, data, { updatedBy: userId });
        await item.save();
        return item;
    }
    async deletePlanningItem(projectId, itemId, userId) {
        const item = await models_1.ProjectPlanningItem.findOne({ _id: itemId, project: projectId, isDeleted: false });
        if (!item)
            throw new ApiResponse_1.ApiError(404, 'Planning item not found');
        item.isDeleted = true;
        item.updatedBy = userId;
        await item.save();
    }
    // Resource assignments
    async checkResourceConflict(resourceType, resourceId, excludeAssignmentId) {
        const query = {
            isDeleted: false,
            status: 'Active',
            resourceType,
        };
        if (resourceType === 'employee')
            query.employee = resourceId;
        if (resourceType === 'vehicle')
            query.vehicle = resourceId;
        if (resourceType === 'equipment')
            query.equipment = resourceId;
        if (excludeAssignmentId)
            query._id = { $ne: excludeAssignmentId };
        const conflict = await models_1.ProjectAssignment.findOne(query).populate('project', 'name code');
        return conflict;
    }
    async createAssignment(projectId, data, userId) {
        await this.getById(projectId);
        const resourceId = data.resourceType === 'employee'
            ? data.employee?.toString()
            : data.resourceType === 'vehicle'
                ? data.vehicle?.toString()
                : data.equipment?.toString();
        if (!resourceId)
            throw new ApiResponse_1.ApiError(400, 'Resource is required');
        const conflict = await this.checkResourceConflict(data.resourceType, resourceId);
        if (conflict) {
            const resourceLabel = data.resourceType === 'employee'
                ? 'Employee'
                : data.resourceType === 'vehicle'
                    ? 'Vehicle'
                    : 'Equipment';
            throw new ApiResponse_1.ApiError(409, `${resourceLabel} is already assigned to project ${conflict.project.code || 'another project'}`);
        }
        const assignment = await models_1.ProjectAssignment.create({
            ...data,
            assignmentId: (0, helpers_1.generateProjectAssignmentId)(),
            project: projectId,
            status: 'Active',
            createdBy: userId,
            updatedBy: userId,
        });
        if (data.resourceType === 'vehicle' && data.vehicle) {
            await models_1.Vehicle.findByIdAndUpdate(data.vehicle, {
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
    async releaseAssignment(projectId, assignmentId, userId, releaseDate) {
        const assignment = await models_1.ProjectAssignment.findOne({
            _id: assignmentId,
            project: projectId,
            isDeleted: false,
        });
        if (!assignment)
            throw new ApiResponse_1.ApiError(404, 'Assignment not found');
        assignment.status = 'Released';
        assignment.releaseDate = releaseDate || new Date();
        assignment.updatedBy = userId;
        await assignment.save();
        if (assignment.resourceType === 'vehicle' && assignment.vehicle) {
            await models_1.Vehicle.findByIdAndUpdate(assignment.vehicle, {
                assignedProject: null,
                currentStatus: 'Available',
                updatedBy: userId,
            });
        }
        return assignment;
    }
    async getResourceAllocations(filters, pagination) {
        const projectQuery = this.buildFilter(filters);
        const projects = await models_1.Project.find(projectQuery).select('_id');
        const projectIds = projects.map((p) => p._id);
        const query = { project: { $in: projectIds }, isDeleted: false };
        const sort = (0, pagination_1.buildSort)(pagination.sortBy || 'assignmentDate', pagination.sortOrder || 'desc');
        const [data, total] = await Promise.all([
            models_1.ProjectAssignment.find(query)
                .populate('project', 'name code client status')
                .populate('employee', 'firstName lastName email role')
                .populate('vehicle', 'vehicleName registrationNumber vehicleId')
                .populate('equipment', 'name equipmentId')
                .sort(sort)
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit),
            models_1.ProjectAssignment.countDocuments(query),
        ]);
        return { data, pagination: (0, pagination_1.buildPaginationMeta)(pagination.page, pagination.limit, total) };
    }
    // Progress
    async createProgress(projectId, data, userId, files) {
        await this.getById(projectId);
        const attachments = files
            ? await Promise.all(files.map((f) => storage_1.storageService.storeFile(f, 'projects')))
            : [];
        const progress = await models_1.ProjectProgress.create({
            ...data,
            project: projectId,
            attachments,
            createdBy: userId,
            updatedBy: userId,
        });
        const project = await models_1.Project.findById(projectId);
        if (project && data.progressPercent !== undefined) {
            project.actualProgressPercent = data.progressPercent;
            project.progressPercent = data.progressPercent;
            project.delayStatus = (0, helpers_1.calculateDelayStatus)(project.plannedProgressPercent, data.progressPercent);
            await project.save();
        }
        await this.recalculateProgress(projectId);
        return progress.populate('createdBy', 'firstName lastName');
    }
    // Documents
    async createDocument(projectId, data, file, userId) {
        await this.getById(projectId);
        const stored = await storage_1.storageService.storeFile(file, 'projects');
        return models_1.ProjectDocument.create({
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
    async replaceDocument(projectId, docId, file, version, userId) {
        const doc = await models_1.ProjectDocument.findOne({ _id: docId, project: projectId, isDeleted: false });
        if (!doc)
            throw new ApiResponse_1.ApiError(404, 'Document not found');
        if (doc.file?.path)
            await storage_1.storageService.deleteFile(doc.file.path);
        const stored = await storage_1.storageService.storeFile(file, 'projects');
        doc.file = stored;
        doc.version = version;
        doc.updatedBy = userId;
        await doc.save();
        return doc;
    }
    async deleteDocument(projectId, docId, userId) {
        const doc = await models_1.ProjectDocument.findOne({ _id: docId, project: projectId, isDeleted: false });
        if (!doc)
            throw new ApiResponse_1.ApiError(404, 'Document not found');
        doc.isDeleted = true;
        doc.updatedBy = userId;
        await doc.save();
    }
    // Financials
    async updateFinancials(projectId, data, userId) {
        await this.getById(projectId);
        const financial = await models_1.ProjectFinancial.findOneAndUpdate({ project: projectId }, { ...data, updatedBy: userId }, { upsert: true, new: true });
        if (data.actualCost !== undefined) {
            await models_1.Project.findByIdAndUpdate(projectId, { actualCost: data.actualCost, updatedBy: userId });
        }
        return financial;
    }
    getFinancialSummary(financial, project) {
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
    async addTeamMember(projectId, data, userId) {
        await this.getById(projectId);
        const user = await models_1.User.findById(data.user);
        if (!user)
            throw new ApiResponse_1.ApiError(404, 'User not found');
        return models_1.ProjectTeam.create({
            ...data,
            project: projectId,
            joinedDate: data.joinedDate || new Date(),
            status: 'Active',
            createdBy: userId,
            updatedBy: userId,
        }).then((t) => t.populate('user', 'firstName lastName email role employeeId'));
    }
    async removeTeamMember(projectId, teamId, userId) {
        const member = await models_1.ProjectTeam.findOne({ _id: teamId, project: projectId, isDeleted: false });
        if (!member)
            throw new ApiResponse_1.ApiError(404, 'Team member not found');
        member.status = 'Inactive';
        member.leftDate = new Date();
        member.isDeleted = true;
        member.updatedBy = userId;
        await member.save();
    }
    async getDashboardStats() {
        const baseFilter = { isDeleted: false, isArchived: false };
        const [total, active, proposal, planning, pendingExecution, completed, delayed, byStatus, resourceSummary, monthlyProgress, timeline,] = await Promise.all([
            models_1.Project.countDocuments(baseFilter),
            models_1.Project.countDocuments({ ...baseFilter, status: 'Active' }),
            models_1.Project.countDocuments({ ...baseFilter, status: 'Proposal Stage' }),
            models_1.Project.countDocuments({ ...baseFilter, status: 'Planning Stage' }),
            models_1.Project.countDocuments({ ...baseFilter, status: 'Pending Execution' }),
            models_1.Project.countDocuments({ ...baseFilter, status: { $in: ['Completed', 'Closed'] } }),
            models_1.Project.countDocuments({ ...baseFilter, delayStatus: 'Delayed' }),
            models_1.Project.aggregate([
                { $match: baseFilter },
                { $group: { _id: '$status', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            models_1.ProjectAssignment.aggregate([
                { $match: { isDeleted: false, status: 'Active' } },
                { $group: { _id: '$resourceType', count: { $sum: 1 } } },
            ]),
            models_1.ProjectProgress.aggregate([
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
            models_1.Project.find(baseFilter)
                .select('name code status startDate endDate progressPercent delayStatus')
                .sort({ startDate: 1 })
                .limit(20),
        ]);
        const [employeeCount, vehicleCount, equipmentCount] = await Promise.all([
            models_1.User.countDocuments({ isActive: true }),
            models_1.Vehicle.countDocuments({ isDeleted: false }),
            models_1.Equipment.countDocuments({ isDeleted: false }),
        ]);
        const activeAssignments = await models_1.ProjectAssignment.countDocuments({
            isDeleted: false,
            status: 'Active',
        });
        const vehicleAssignments = resourceSummary.find((r) => r._id === 'vehicle')?.count || 0;
        const employeeAssignments = resourceSummary.find((r) => r._id === 'employee')?.count || 0;
        const overallProgressAgg = await models_1.Project.aggregate([
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
            manpowerUtilization: employeeCount > 0 ? Math.round((employeeAssignments / employeeCount) * 100) : 0,
            vehicleAllocation: vehicleCount > 0 ? Math.round((vehicleAssignments / vehicleCount) * 100) : 0,
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
    async getExportData(filters) {
        const query = this.buildFilter(filters);
        return models_1.Project.find(query).populate(this.projectPopulate).sort({ createdAt: -1 });
    }
}
exports.ProjectService = ProjectService;
exports.projectService = new ProjectService();
//# sourceMappingURL=projectService.js.map