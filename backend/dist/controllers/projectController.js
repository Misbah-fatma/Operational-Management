"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTeamMember = exports.addTeamMember = exports.updateFinancials = exports.downloadDocument = exports.deleteDocument = exports.replaceDocument = exports.createDocument = exports.createProgress = exports.getResourceAllocations = exports.checkResourceConflict = exports.releaseProjectAssignment = exports.createProjectAssignment = exports.deletePlanningItem = exports.updatePlanningItem = exports.createPlanningItem = exports.deleteMilestone = exports.updateMilestone = exports.createMilestone = exports.exportProjectsPdf = exports.exportProjectsExcel = exports.getProjectDashboard = exports.bulkProjectAction = exports.duplicateProject = exports.archiveProject = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectDetail = exports.getProject = exports.getProjects = void 0;
const projectService_1 = require("../services/projectService");
const ApiResponse_1 = require("../utils/ApiResponse");
const pagination_1 = require("../utils/pagination");
const helpers_1 = require("../utils/helpers");
const storage_1 = require("../utils/storage");
const params_1 = require("../utils/params");
const getProjects = async (req, res, next) => {
    try {
        const result = await projectService_1.projectService.getAll({
            search: req.query.search,
            status: req.query.status,
            client: req.query.client,
            projectManager: req.query.projectManager,
            startDateFrom: req.query.startDateFrom,
            startDateTo: req.query.startDateTo,
            isArchived: req.query.isArchived === 'true' ? true : req.query.isArchived === 'false' ? false : undefined,
        }, (0, pagination_1.getPagination)(req));
        res.json(ApiResponse_1.ApiResponse.success('Projects retrieved', result.data, { pagination: result.pagination }));
    }
    catch (error) {
        next(error);
    }
};
exports.getProjects = getProjects;
const getProject = async (req, res, next) => {
    try {
        const project = await projectService_1.projectService.getById((0, params_1.getParam)(req, 'id'));
        res.json(ApiResponse_1.ApiResponse.success('Project retrieved', project));
    }
    catch (error) {
        next(error);
    }
};
exports.getProject = getProject;
const getProjectDetail = async (req, res, next) => {
    try {
        const detail = await projectService_1.projectService.getDetail((0, params_1.getParam)(req, 'id'));
        const financialSummary = projectService_1.projectService.getFinancialSummary(detail.financial, detail.project);
        res.json(ApiResponse_1.ApiResponse.success('Project detail retrieved', { ...detail, financialSummary }));
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectDetail = getProjectDetail;
const createProject = async (req, res, next) => {
    try {
        const project = await projectService_1.projectService.create({
            ...req.body,
            createdBy: req.user._id.toString(),
        });
        res.status(201).json(ApiResponse_1.ApiResponse.success('Project created', project));
    }
    catch (error) {
        next(error);
    }
};
exports.createProject = createProject;
const updateProject = async (req, res, next) => {
    try {
        const project = await projectService_1.projectService.update((0, params_1.getParam)(req, 'id'), req.body, req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Project updated', project));
    }
    catch (error) {
        next(error);
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res, next) => {
    try {
        await projectService_1.projectService.softDelete((0, params_1.getParam)(req, 'id'), req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Project deleted'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProject = deleteProject;
const archiveProject = async (req, res, next) => {
    try {
        const project = await projectService_1.projectService.archive((0, params_1.getParam)(req, 'id'), req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Project archived', project));
    }
    catch (error) {
        next(error);
    }
};
exports.archiveProject = archiveProject;
const duplicateProject = async (req, res, next) => {
    try {
        const project = await projectService_1.projectService.duplicate((0, params_1.getParam)(req, 'id'), req.user._id.toString());
        res.status(201).json(ApiResponse_1.ApiResponse.success('Project duplicated', project));
    }
    catch (error) {
        next(error);
    }
};
exports.duplicateProject = duplicateProject;
const bulkProjectAction = async (req, res, next) => {
    try {
        const { ids, action } = req.body;
        const count = await projectService_1.projectService.bulkAction(ids, action, req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success(`${count} project(s) processed`));
    }
    catch (error) {
        next(error);
    }
};
exports.bulkProjectAction = bulkProjectAction;
const getProjectDashboard = async (req, res, next) => {
    try {
        const stats = await projectService_1.projectService.getDashboardStats();
        res.json(ApiResponse_1.ApiResponse.success('Project dashboard retrieved', stats));
    }
    catch (error) {
        next(error);
    }
};
exports.getProjectDashboard = getProjectDashboard;
const exportProjectsExcel = async (req, res, next) => {
    try {
        const data = await projectService_1.projectService.getExportData({
            search: req.query.search,
            status: req.query.status,
            client: req.query.client,
        });
        const rows = data.map((p) => ({
            code: p.code,
            name: p.name,
            client: p.client,
            contractNumber: p.contractNumber,
            location: p.location,
            startDate: p.startDate?.toLocaleDateString(),
            endDate: p.endDate?.toLocaleDateString(),
            budget: p.budget,
            status: p.status,
            progressPercent: p.progressPercent,
        }));
        await (0, helpers_1.exportToExcel)(res, 'projects', [
            { header: 'Project ID', key: 'code', width: 15 },
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Client', key: 'client', width: 20 },
            { header: 'Contract #', key: 'contractNumber', width: 15 },
            { header: 'Location', key: 'location', width: 20 },
            { header: 'Start', key: 'startDate', width: 12 },
            { header: 'End', key: 'endDate', width: 12 },
            { header: 'Budget', key: 'budget', width: 12 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Progress', key: 'progressPercent', width: 10 },
        ], rows);
    }
    catch (error) {
        next(error);
    }
};
exports.exportProjectsExcel = exportProjectsExcel;
const exportProjectsPdf = async (req, res, next) => {
    try {
        const data = await projectService_1.projectService.getExportData({
            search: req.query.search,
            status: req.query.status,
            client: req.query.client,
        });
        const columns = ['ID', 'Name', 'Client', 'Status', 'Progress %', 'Budget'];
        const rows = data.map((p) => [
            p.code,
            p.name,
            p.client || '',
            p.status,
            String(p.progressPercent),
            String(p.budget || 0),
        ]);
        (0, helpers_1.exportToPdf)(res, 'projects', 'Projects Report', columns, rows);
    }
    catch (error) {
        next(error);
    }
};
exports.exportProjectsPdf = exportProjectsPdf;
// Milestones
const createMilestone = async (req, res, next) => {
    try {
        const milestone = await projectService_1.projectService.createMilestone((0, params_1.getParam)(req, 'id'), req.body, req.user._id.toString());
        res.status(201).json(ApiResponse_1.ApiResponse.success('Milestone created', milestone));
    }
    catch (error) {
        next(error);
    }
};
exports.createMilestone = createMilestone;
const updateMilestone = async (req, res, next) => {
    try {
        const milestone = await projectService_1.projectService.updateMilestone((0, params_1.getParam)(req, 'id'), (0, params_1.getParam)(req, 'milestoneId'), req.body, req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Milestone updated', milestone));
    }
    catch (error) {
        next(error);
    }
};
exports.updateMilestone = updateMilestone;
const deleteMilestone = async (req, res, next) => {
    try {
        await projectService_1.projectService.deleteMilestone((0, params_1.getParam)(req, 'id'), (0, params_1.getParam)(req, 'milestoneId'), req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Milestone deleted'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMilestone = deleteMilestone;
// Planning
const createPlanningItem = async (req, res, next) => {
    try {
        const item = await projectService_1.projectService.createPlanningItem((0, params_1.getParam)(req, 'id'), req.body, req.user._id.toString());
        res.status(201).json(ApiResponse_1.ApiResponse.success('Planning item created', item));
    }
    catch (error) {
        next(error);
    }
};
exports.createPlanningItem = createPlanningItem;
const updatePlanningItem = async (req, res, next) => {
    try {
        const item = await projectService_1.projectService.updatePlanningItem((0, params_1.getParam)(req, 'id'), (0, params_1.getParam)(req, 'itemId'), req.body, req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Planning item updated', item));
    }
    catch (error) {
        next(error);
    }
};
exports.updatePlanningItem = updatePlanningItem;
const deletePlanningItem = async (req, res, next) => {
    try {
        await projectService_1.projectService.deletePlanningItem((0, params_1.getParam)(req, 'id'), (0, params_1.getParam)(req, 'itemId'), req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Planning item deleted'));
    }
    catch (error) {
        next(error);
    }
};
exports.deletePlanningItem = deletePlanningItem;
// Assignments
const createProjectAssignment = async (req, res, next) => {
    try {
        const assignment = await projectService_1.projectService.createAssignment((0, params_1.getParam)(req, 'id'), req.body, req.user._id.toString());
        res.status(201).json(ApiResponse_1.ApiResponse.success('Assignment created', assignment));
    }
    catch (error) {
        next(error);
    }
};
exports.createProjectAssignment = createProjectAssignment;
const releaseProjectAssignment = async (req, res, next) => {
    try {
        const assignment = await projectService_1.projectService.releaseAssignment((0, params_1.getParam)(req, 'id'), (0, params_1.getParam)(req, 'assignmentId'), req.user._id.toString(), req.body.releaseDate ? new Date(req.body.releaseDate) : undefined);
        res.json(ApiResponse_1.ApiResponse.success('Assignment released', assignment));
    }
    catch (error) {
        next(error);
    }
};
exports.releaseProjectAssignment = releaseProjectAssignment;
const checkResourceConflict = async (req, res, next) => {
    try {
        const { resourceType, resourceId } = req.query;
        const conflict = await projectService_1.projectService.checkResourceConflict(resourceType, resourceId);
        res.json(ApiResponse_1.ApiResponse.success('Resource check completed', {
            hasConflict: !!conflict,
            conflict,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.checkResourceConflict = checkResourceConflict;
const getResourceAllocations = async (req, res, next) => {
    try {
        const result = await projectService_1.projectService.getResourceAllocations({
            search: req.query.search,
            status: req.query.status,
            client: req.query.client,
        }, (0, pagination_1.getPagination)(req));
        res.json(ApiResponse_1.ApiResponse.success('Resource allocations retrieved', result.data, {
            pagination: result.pagination,
        }));
    }
    catch (error) {
        next(error);
    }
};
exports.getResourceAllocations = getResourceAllocations;
// Progress
const createProgress = async (req, res, next) => {
    try {
        const files = req.files;
        const progress = await projectService_1.projectService.createProgress((0, params_1.getParam)(req, 'id'), req.body, req.user._id.toString(), files);
        res.status(201).json(ApiResponse_1.ApiResponse.success('Progress update created', progress));
    }
    catch (error) {
        next(error);
    }
};
exports.createProgress = createProgress;
// Documents
const createDocument = async (req, res, next) => {
    try {
        const doc = await projectService_1.projectService.createDocument((0, params_1.getParam)(req, 'id'), req.body, req.file, req.user._id.toString());
        res.status(201).json(ApiResponse_1.ApiResponse.success('Document uploaded', doc));
    }
    catch (error) {
        next(error);
    }
};
exports.createDocument = createDocument;
const replaceDocument = async (req, res, next) => {
    try {
        const doc = await projectService_1.projectService.replaceDocument((0, params_1.getParam)(req, 'id'), (0, params_1.getParam)(req, 'docId'), req.file, req.body.version || '1.0', req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Document replaced', doc));
    }
    catch (error) {
        next(error);
    }
};
exports.replaceDocument = replaceDocument;
const deleteDocument = async (req, res, next) => {
    try {
        await projectService_1.projectService.deleteDocument((0, params_1.getParam)(req, 'id'), (0, params_1.getParam)(req, 'docId'), req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Document deleted'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteDocument = deleteDocument;
const downloadDocument = async (req, res, next) => {
    try {
        const detail = await projectService_1.projectService.getDetail((0, params_1.getParam)(req, 'id'));
        const doc = detail.documents.find((d) => d._id.toString() === (0, params_1.getParam)(req, 'docId'));
        if (!doc?.file?.path) {
            throw new ApiResponse_1.ApiError(404, 'File not found');
        }
        res.download(storage_1.storageService.getAbsolutePath(doc.file.path), doc.fileName);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadDocument = downloadDocument;
// Financials
const updateFinancials = async (req, res, next) => {
    try {
        const financial = await projectService_1.projectService.updateFinancials((0, params_1.getParam)(req, 'id'), req.body, req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Financials updated', financial));
    }
    catch (error) {
        next(error);
    }
};
exports.updateFinancials = updateFinancials;
// Team
const addTeamMember = async (req, res, next) => {
    try {
        const member = await projectService_1.projectService.addTeamMember((0, params_1.getParam)(req, 'id'), req.body, req.user._id.toString());
        res.status(201).json(ApiResponse_1.ApiResponse.success('Team member added', member));
    }
    catch (error) {
        next(error);
    }
};
exports.addTeamMember = addTeamMember;
const removeTeamMember = async (req, res, next) => {
    try {
        await projectService_1.projectService.removeTeamMember((0, params_1.getParam)(req, 'id'), (0, params_1.getParam)(req, 'teamId'), req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Team member removed'));
    }
    catch (error) {
        next(error);
    }
};
exports.removeTeamMember = removeTeamMember;
//# sourceMappingURL=projectController.js.map