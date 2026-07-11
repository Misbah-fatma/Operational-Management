import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { projectService } from '../services/projectService';
import { ApiResponse, ApiError } from '../utils/ApiResponse';
import { getPagination } from '../utils/pagination';
import { exportToExcel, exportToPdf } from '../utils/helpers';
import { storageService } from '../utils/storage';
import { getParam } from '../utils/params';

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await projectService.getAll(
      {
        search: req.query.search as string,
        status: req.query.status as string,
        client: req.query.client as string,
        projectManager: req.query.projectManager as string,
        startDateFrom: req.query.startDateFrom as string,
        startDateTo: req.query.startDateTo as string,
        isArchived: req.query.isArchived === 'true' ? true : req.query.isArchived === 'false' ? false : undefined,
      },
      getPagination(req),
    );
    res.json(ApiResponse.success('Projects retrieved', result.data, { pagination: result.pagination }));
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.getById(getParam(req, 'id'));
    res.json(ApiResponse.success('Project retrieved', project));
  } catch (error) {
    next(error);
  }
};

export const getProjectDetail = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const detail = await projectService.getDetail(getParam(req, 'id'));
    const financialSummary = projectService.getFinancialSummary(
      detail.financial,
      detail.project,
    );
    res.json(ApiResponse.success('Project detail retrieved', { ...detail, financialSummary }));
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.create({
      ...req.body,
      createdBy: req.user!._id.toString(),
    });
    res.status(201).json(ApiResponse.success('Project created', project));
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.update(
      getParam(req, 'id'),
      req.body,
      req.user!._id.toString(),
    );
    res.json(ApiResponse.success('Project updated', project));
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await projectService.softDelete(getParam(req, 'id'), req.user!._id.toString());
    res.json(ApiResponse.success('Project deleted'));
  } catch (error) {
    next(error);
  }
};

export const archiveProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.archive(getParam(req, 'id'), req.user!._id.toString());
    res.json(ApiResponse.success('Project archived', project));
  } catch (error) {
    next(error);
  }
};

export const duplicateProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.duplicate(getParam(req, 'id'), req.user!._id.toString());
    res.status(201).json(ApiResponse.success('Project duplicated', project));
  } catch (error) {
    next(error);
  }
};

export const bulkProjectAction = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { ids, action } = req.body;
    const count = await projectService.bulkAction(ids, action, req.user!._id.toString());
    res.json(ApiResponse.success(`${count} project(s) processed`));
  } catch (error) {
    next(error);
  }
};

export const getProjectDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await projectService.getDashboardStats();
    res.json(ApiResponse.success('Project dashboard retrieved', stats));
  } catch (error) {
    next(error);
  }
};

export const exportProjectsExcel = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await projectService.getExportData({
      search: req.query.search as string,
      status: req.query.status as string,
      client: req.query.client as string,
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
    await exportToExcel(res, 'projects', [
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
  } catch (error) {
    next(error);
  }
};

export const exportProjectsPdf = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = await projectService.getExportData({
      search: req.query.search as string,
      status: req.query.status as string,
      client: req.query.client as string,
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
    exportToPdf(res, 'projects', 'Projects Report', columns, rows);
  } catch (error) {
    next(error);
  }
};

// Milestones
export const createMilestone = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const milestone = await projectService.createMilestone(
      getParam(req, 'id'),
      req.body,
      req.user!._id.toString(),
    );
    res.status(201).json(ApiResponse.success('Milestone created', milestone));
  } catch (error) {
    next(error);
  }
};

export const updateMilestone = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const milestone = await projectService.updateMilestone(
      getParam(req, 'id'),
      getParam(req, 'milestoneId'),
      req.body,
      req.user!._id.toString(),
    );
    res.json(ApiResponse.success('Milestone updated', milestone));
  } catch (error) {
    next(error);
  }
};

export const deleteMilestone = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await projectService.deleteMilestone(
      getParam(req, 'id'),
      getParam(req, 'milestoneId'),
      req.user!._id.toString(),
    );
    res.json(ApiResponse.success('Milestone deleted'));
  } catch (error) {
    next(error);
  }
};

// Planning
export const createPlanningItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const item = await projectService.createPlanningItem(
      getParam(req, 'id'),
      req.body,
      req.user!._id.toString(),
    );
    res.status(201).json(ApiResponse.success('Planning item created', item));
  } catch (error) {
    next(error);
  }
};

export const updatePlanningItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const item = await projectService.updatePlanningItem(
      getParam(req, 'id'),
      getParam(req, 'itemId'),
      req.body,
      req.user!._id.toString(),
    );
    res.json(ApiResponse.success('Planning item updated', item));
  } catch (error) {
    next(error);
  }
};

export const deletePlanningItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await projectService.deletePlanningItem(
      getParam(req, 'id'),
      getParam(req, 'itemId'),
      req.user!._id.toString(),
    );
    res.json(ApiResponse.success('Planning item deleted'));
  } catch (error) {
    next(error);
  }
};

// Assignments
export const createProjectAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const assignment = await projectService.createAssignment(
      getParam(req, 'id'),
      req.body,
      req.user!._id.toString(),
    );
    res.status(201).json(ApiResponse.success('Assignment created', assignment));
  } catch (error) {
    next(error);
  }
};

export const releaseProjectAssignment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const assignment = await projectService.releaseAssignment(
      getParam(req, 'id'),
      getParam(req, 'assignmentId'),
      req.user!._id.toString(),
      req.body.releaseDate ? new Date(req.body.releaseDate) : undefined,
    );
    res.json(ApiResponse.success('Assignment released', assignment));
  } catch (error) {
    next(error);
  }
};

export const checkResourceConflict = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { resourceType, resourceId } = req.query;
    const conflict = await projectService.checkResourceConflict(
      resourceType as string,
      resourceId as string,
    );
    res.json(
      ApiResponse.success('Resource check completed', {
        hasConflict: !!conflict,
        conflict,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const getResourceAllocations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await projectService.getResourceAllocations(
      {
        search: req.query.search as string,
        status: req.query.status as string,
        client: req.query.client as string,
      },
      getPagination(req),
    );
    res.json(ApiResponse.success('Resource allocations retrieved', result.data, {
      pagination: result.pagination,
    }));
  } catch (error) {
    next(error);
  }
};

// Progress
export const createProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    const progress = await projectService.createProgress(
      getParam(req, 'id'),
      req.body,
      req.user!._id.toString(),
      files,
    );
    res.status(201).json(ApiResponse.success('Progress update created', progress));
  } catch (error) {
    next(error);
  }
};

// Documents
export const createDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doc = await projectService.createDocument(
      getParam(req, 'id'),
      req.body,
      req.file!,
      req.user!._id.toString(),
    );
    res.status(201).json(ApiResponse.success('Document uploaded', doc));
  } catch (error) {
    next(error);
  }
};

export const replaceDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const doc = await projectService.replaceDocument(
      getParam(req, 'id'),
      getParam(req, 'docId'),
      req.file!,
      req.body.version || '1.0',
      req.user!._id.toString(),
    );
    res.json(ApiResponse.success('Document replaced', doc));
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await projectService.deleteDocument(
      getParam(req, 'id'),
      getParam(req, 'docId'),
      req.user!._id.toString(),
    );
    res.json(ApiResponse.success('Document deleted'));
  } catch (error) {
    next(error);
  }
};

export const downloadDocument = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const detail = await projectService.getDetail(getParam(req, 'id'));
    const doc = detail.documents.find((d) => d._id.toString() === getParam(req, 'docId'));
    if (!doc?.file?.path) {
      throw new ApiError(404, 'File not found');
    }
    res.download(storageService.getAbsolutePath(doc.file.path), doc.fileName);
  } catch (error) {
    next(error);
  }
};

// Financials
export const updateFinancials = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const financial = await projectService.updateFinancials(
      getParam(req, 'id'),
      req.body,
      req.user!._id.toString(),
    );
    res.json(ApiResponse.success('Financials updated', financial));
  } catch (error) {
    next(error);
  }
};

// Team
export const addTeamMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const member = await projectService.addTeamMember(
      getParam(req, 'id'),
      req.body,
      req.user!._id.toString(),
    );
    res.status(201).json(ApiResponse.success('Team member added', member));
  } catch (error) {
    next(error);
  }
};

export const removeTeamMember = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await projectService.removeTeamMember(
      getParam(req, 'id'),
      getParam(req, 'teamId'),
      req.user!._id.toString(),
    );
    res.json(ApiResponse.success('Team member removed'));
  } catch (error) {
    next(error);
  }
};
