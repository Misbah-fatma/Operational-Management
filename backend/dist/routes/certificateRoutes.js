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
const certificateController = __importStar(require("../controllers/certificateController"));
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const validate_1 = require("../middleware/validate");
const upload_1 = require("../middleware/upload");
const audit_1 = require("../middleware/audit");
const validators_1 = require("../validators");
const constants_1 = require("../constants");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/dashboard', (0, rbac_1.authorize)(constants_1.PERMISSIONS.DASHBOARD_READ), certificateController.getCertificateDashboard);
router.get('/export/excel', (0, rbac_1.authorize)(constants_1.PERMISSIONS.CERTIFICATES_EXPORT), certificateController.exportCertificatesExcel);
router.get('/export/pdf', (0, rbac_1.authorize)(constants_1.PERMISSIONS.CERTIFICATES_EXPORT), certificateController.exportCertificatesPdf);
router.get('/', (0, rbac_1.authorize)(constants_1.PERMISSIONS.CERTIFICATES_READ), (0, validate_1.validate)(validators_1.paginationValidation), certificateController.getCertificates);
router.get('/:id/download', (0, rbac_1.authorize)(constants_1.PERMISSIONS.CERTIFICATES_READ), (0, validate_1.validate)(validators_1.idParamValidation), certificateController.downloadCertificate);
router.get('/:id', (0, rbac_1.authorize)(constants_1.PERMISSIONS.CERTIFICATES_READ), (0, validate_1.validate)(validators_1.idParamValidation), certificateController.getCertificate);
router.post('/', (0, rbac_1.authorize)(constants_1.PERMISSIONS.CERTIFICATES_CREATE), upload_1.uploadCertificate, upload_1.handleMulterError, (0, validate_1.validate)(validators_1.certificateValidation), (0, audit_1.auditLog)('CREATE', 'Certificate'), certificateController.createCertificate);
router.put('/:id', (0, rbac_1.authorize)(constants_1.PERMISSIONS.CERTIFICATES_UPDATE), upload_1.uploadCertificate, upload_1.handleMulterError, (0, validate_1.validate)([...validators_1.idParamValidation, ...validators_1.certificateValidation]), (0, audit_1.auditLog)('UPDATE', 'Certificate'), certificateController.updateCertificate);
router.delete('/:id', (0, rbac_1.authorize)(constants_1.PERMISSIONS.CERTIFICATES_DELETE), (0, validate_1.validate)(validators_1.idParamValidation), (0, audit_1.auditLog)('DELETE', 'Certificate'), certificateController.deleteCertificate);
exports.default = router;
//# sourceMappingURL=certificateRoutes.js.map