"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController = __importStar(require("../controllers/projectController"));
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const validate_1 = require("../middleware/validate");
const audit_1 = require("../middleware/audit");
const upload_1 = require("../middleware/upload");
const validators_1 = require("../validators");
const constants_1 = require("../constants");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
const milestoneIdValidation = [(0, express_validator_1.param)('milestoneId').isMongoId()];
const itemIdValidation = [(0, express_validator_1.param)('itemId').isMongoId()];
const assignmentIdValidation = [(0, express_validator_1.param)('assignmentId').isMongoId()];
const docIdValidation = [(0, express_validator_1.param)('docId').isMongoId()];
const teamIdValidation = [(0, express_validator_1.param)('teamId').isMongoId()];
router.get('/dashboard', (0, rbac_1.authorize)(constants_1.PERMISSIONS.DASHBOARD_READ), projectController.getProjectDashboard);
router.get('/resource-allocations', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_READ), (0, validate_1.validate)(validators_1.paginationValidation), projectController.getResourceAllocations);
router.get('/resource-allocations/check', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_READ), projectController.checkResourceConflict);
router.get('/export/excel', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_EXPORT), projectController.exportProjectsExcel);
router.get('/export/pdf', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_EXPORT), projectController.exportProjectsPdf);
router.post('/bulk', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)(validators_1.bulkActionValidation), (0, audit_1.auditLog)('UPDATE', 'Project'), projectController.bulkProjectAction);
router.get('/', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_READ), (0, validate_1.validate)(validators_1.paginationValidation), projectController.getProjects);
router.get('/:id/detail', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_READ), (0, validate_1.validate)(validators_1.idParamValidation), projectController.getProjectDetail);
router.get('/:id', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_READ), (0, validate_1.validate)(validators_1.idParamValidation), projectController.getProject);
router.post('/', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_CREATE), (0, validate_1.validate)(validators_1.projectValidation), (0, audit_1.auditLog)('CREATE', 'Project'), projectController.createProject);
router.put('/:id', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)([...validators_1.idParamValidation, ...validators_1.projectValidation]), (0, audit_1.auditLog)('UPDATE', 'Project'), projectController.updateProject);
router.patch('/:id/archive', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_ARCHIVE), (0, validate_1.validate)(validators_1.idParamValidation), (0, audit_1.auditLog)('UPDATE', 'Project'), projectController.archiveProject);
router.post('/:id/duplicate', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_CREATE), (0, validate_1.validate)(validators_1.idParamValidation), (0, audit_1.auditLog)('CREATE', 'Project'), projectController.duplicateProject);
router.delete('/:id', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_DELETE), (0, validate_1.validate)(validators_1.idParamValidation), (0, audit_1.auditLog)('DELETE', 'Project'), projectController.deleteProject);
// Milestones
router.post('/:id/milestones', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)([...validators_1.idParamValidation, ...validators_1.milestoneValidation]), projectController.createMilestone);
router.put('/:id/milestones/:milestoneId', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)([...validators_1.idParamValidation, ...milestoneIdValidation, ...validators_1.milestoneValidation]), projectController.updateMilestone);
router.delete('/:id/milestones/:milestoneId', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)([...validators_1.idParamValidation, ...milestoneIdValidation]), projectController.deleteMilestone);
// Planning
router.post('/:id/planning', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)(validators_1.idParamValidation), projectController.createPlanningItem);
router.put('/:id/planning/:itemId', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)([...validators_1.idParamValidation, ...itemIdValidation]), projectController.updatePlanningItem);
router.delete('/:id/planning/:itemId', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)([...validators_1.idParamValidation, ...itemIdValidation]), projectController.deletePlanningItem);
// Assignments
router.post('/:id/assignments', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)([...validators_1.idParamValidation, ...validators_1.projectAssignmentValidation]), projectController.createProjectAssignment);
router.patch('/:id/assignments/:assignmentId/release', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)([...validators_1.idParamValidation, ...assignmentIdValidation]), projectController.releaseProjectAssignment);
// Progress
router.post('/:id/progress', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), upload_1.uploadProgressAttachments, upload_1.handleMulterError, (0, validate_1.validate)([...validators_1.idParamValidation, ...validators_1.projectProgressValidation]), projectController.createProgress);
// Documents
router.get('/:id/documents/:docId/download', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_READ), (0, validate_1.validate)([...validators_1.idParamValidation, ...docIdValidation]), projectController.downloadDocument);
router.post('/:id/documents', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), upload_1.uploadProjectDocument, upload_1.handleMulterError, (0, validate_1.validate)([...validators_1.idParamValidation, ...validators_1.projectDocumentValidation]), projectController.createDocument);
router.put('/:id/documents/:docId', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), upload_1.uploadProjectDocument, upload_1.handleMulterError, (0, validate_1.validate)([...validators_1.idParamValidation, ...docIdValidation]), projectController.replaceDocument);
router.delete('/:id/documents/:docId', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)([...validators_1.idParamValidation, ...docIdValidation]), projectController.deleteDocument);
// Financials
router.put('/:id/financials', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)(validators_1.idParamValidation), projectController.updateFinancials);
// Team
router.post('/:id/team', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)(validators_1.idParamValidation), projectController.addTeamMember);
router.delete('/:id/team/:teamId', (0, rbac_1.authorize)(constants_1.PERMISSIONS.PROJECTS_UPDATE), (0, validate_1.validate)([...validators_1.idParamValidation, ...teamIdValidation]), projectController.removeTeamMember);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map