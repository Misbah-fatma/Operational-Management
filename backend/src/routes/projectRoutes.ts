import { Router } from 'express';
import * as projectController from '../controllers/projectController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { auditLog } from '../middleware/audit';
import {
  uploadProjectDocument,
  uploadProgressAttachments,
  handleMulterError,
} from '../middleware/upload';
import {
  projectValidation,
  milestoneValidation,
  projectAssignmentValidation,
  projectProgressValidation,
  projectDocumentValidation,
  bulkActionValidation,
  idParamValidation,
  paginationValidation,
} from '../validators';
import { PERMISSIONS } from '../constants';
import { param } from 'express-validator';

const router = Router();
router.use(authenticate);

const milestoneIdValidation = [param('milestoneId').isMongoId()];
const itemIdValidation = [param('itemId').isMongoId()];
const assignmentIdValidation = [param('assignmentId').isMongoId()];
const docIdValidation = [param('docId').isMongoId()];
const teamIdValidation = [param('teamId').isMongoId()];

router.get('/dashboard', authorize(PERMISSIONS.DASHBOARD_READ), projectController.getProjectDashboard);

router.get(
  '/resource-allocations',
  authorize(PERMISSIONS.PROJECTS_READ),
  validate(paginationValidation),
  projectController.getResourceAllocations,
);

router.get(
  '/resource-allocations/check',
  authorize(PERMISSIONS.PROJECTS_READ),
  projectController.checkResourceConflict,
);

router.get(
  '/export/excel',
  authorize(PERMISSIONS.PROJECTS_EXPORT),
  projectController.exportProjectsExcel,
);

router.get(
  '/export/pdf',
  authorize(PERMISSIONS.PROJECTS_EXPORT),
  projectController.exportProjectsPdf,
);

router.post(
  '/bulk',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate(bulkActionValidation),
  auditLog('UPDATE', 'Project'),
  projectController.bulkProjectAction,
);

router.get(
  '/',
  authorize(PERMISSIONS.PROJECTS_READ),
  validate(paginationValidation),
  projectController.getProjects,
);

router.get(
  '/:id/detail',
  authorize(PERMISSIONS.PROJECTS_READ),
  validate(idParamValidation),
  projectController.getProjectDetail,
);

router.get(
  '/:id',
  authorize(PERMISSIONS.PROJECTS_READ),
  validate(idParamValidation),
  projectController.getProject,
);

router.post(
  '/',
  authorize(PERMISSIONS.PROJECTS_CREATE),
  validate(projectValidation),
  auditLog('CREATE', 'Project'),
  projectController.createProject,
);

router.put(
  '/:id',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate([...idParamValidation, ...projectValidation]),
  auditLog('UPDATE', 'Project'),
  projectController.updateProject,
);

router.patch(
  '/:id/archive',
  authorize(PERMISSIONS.PROJECTS_ARCHIVE),
  validate(idParamValidation),
  auditLog('UPDATE', 'Project'),
  projectController.archiveProject,
);

router.post(
  '/:id/duplicate',
  authorize(PERMISSIONS.PROJECTS_CREATE),
  validate(idParamValidation),
  auditLog('CREATE', 'Project'),
  projectController.duplicateProject,
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.PROJECTS_DELETE),
  validate(idParamValidation),
  auditLog('DELETE', 'Project'),
  projectController.deleteProject,
);

// Milestones
router.post(
  '/:id/milestones',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate([...idParamValidation, ...milestoneValidation]),
  projectController.createMilestone,
);

router.put(
  '/:id/milestones/:milestoneId',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate([...idParamValidation, ...milestoneIdValidation, ...milestoneValidation]),
  projectController.updateMilestone,
);

router.delete(
  '/:id/milestones/:milestoneId',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate([...idParamValidation, ...milestoneIdValidation]),
  projectController.deleteMilestone,
);

// Planning
router.post(
  '/:id/planning',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate(idParamValidation),
  projectController.createPlanningItem,
);

router.put(
  '/:id/planning/:itemId',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate([...idParamValidation, ...itemIdValidation]),
  projectController.updatePlanningItem,
);

router.delete(
  '/:id/planning/:itemId',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate([...idParamValidation, ...itemIdValidation]),
  projectController.deletePlanningItem,
);

// Assignments
router.post(
  '/:id/assignments',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate([...idParamValidation, ...projectAssignmentValidation]),
  projectController.createProjectAssignment,
);

router.patch(
  '/:id/assignments/:assignmentId/release',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate([...idParamValidation, ...assignmentIdValidation]),
  projectController.releaseProjectAssignment,
);

// Progress
router.post(
  '/:id/progress',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  uploadProgressAttachments,
  handleMulterError,
  validate([...idParamValidation, ...projectProgressValidation]),
  projectController.createProgress,
);

// Documents
router.get(
  '/:id/documents/:docId/download',
  authorize(PERMISSIONS.PROJECTS_READ),
  validate([...idParamValidation, ...docIdValidation]),
  projectController.downloadDocument,
);

router.post(
  '/:id/documents',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  uploadProjectDocument,
  handleMulterError,
  validate([...idParamValidation, ...projectDocumentValidation]),
  projectController.createDocument,
);

router.put(
  '/:id/documents/:docId',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  uploadProjectDocument,
  handleMulterError,
  validate([...idParamValidation, ...docIdValidation]),
  projectController.replaceDocument,
);

router.delete(
  '/:id/documents/:docId',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate([...idParamValidation, ...docIdValidation]),
  projectController.deleteDocument,
);

// Financials
router.put(
  '/:id/financials',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate(idParamValidation),
  projectController.updateFinancials,
);

// Team
router.post(
  '/:id/team',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate(idParamValidation),
  projectController.addTeamMember,
);

router.delete(
  '/:id/team/:teamId',
  authorize(PERMISSIONS.PROJECTS_UPDATE),
  validate([...idParamValidation, ...teamIdValidation]),
  projectController.removeTeamMember,
);

export default router;
