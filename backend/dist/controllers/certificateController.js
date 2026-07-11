"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportCertificatesPdf = exports.exportCertificatesExcel = exports.getCertificateDashboard = exports.downloadCertificate = exports.deleteCertificate = exports.updateCertificate = exports.createCertificate = exports.getCertificate = exports.getCertificates = void 0;
const certificateService_1 = require("../services/certificateService");
const ApiResponse_1 = require("../utils/ApiResponse");
const pagination_1 = require("../utils/pagination");
const helpers_1 = require("../utils/helpers");
const storage_1 = require("../utils/storage");
const params_1 = require("../utils/params");
const getCertificates = async (req, res, next) => {
    try {
        const result = await certificateService_1.certificateService.getAll({
            search: req.query.search,
            category: req.query.category,
            status: req.query.status,
            relatedEmployee: req.query.relatedEmployee,
            relatedEquipment: req.query.relatedEquipment,
            relatedVehicle: req.query.relatedVehicle,
            relatedProject: req.query.relatedProject,
            expiryFrom: req.query.expiryFrom,
            expiryTo: req.query.expiryTo,
        }, (0, pagination_1.getPagination)(req));
        res.json(ApiResponse_1.ApiResponse.success('Certificates retrieved', result.data, { pagination: result.pagination }));
    }
    catch (error) {
        next(error);
    }
};
exports.getCertificates = getCertificates;
const getCertificate = async (req, res, next) => {
    try {
        const cert = await certificateService_1.certificateService.getById((0, params_1.getParam)(req, 'id'));
        res.json(ApiResponse_1.ApiResponse.success('Certificate retrieved', cert));
    }
    catch (error) {
        next(error);
    }
};
exports.getCertificate = getCertificate;
const createCertificate = async (req, res, next) => {
    try {
        const cert = await certificateService_1.certificateService.create({ ...req.body, createdBy: req.user._id.toString() }, req.file);
        res.status(201).json(ApiResponse_1.ApiResponse.success('Certificate created', cert));
    }
    catch (error) {
        next(error);
    }
};
exports.createCertificate = createCertificate;
const updateCertificate = async (req, res, next) => {
    try {
        const cert = await certificateService_1.certificateService.update((0, params_1.getParam)(req, 'id'), req.body, req.user._id.toString(), req.file);
        res.json(ApiResponse_1.ApiResponse.success('Certificate updated', cert));
    }
    catch (error) {
        next(error);
    }
};
exports.updateCertificate = updateCertificate;
const deleteCertificate = async (req, res, next) => {
    try {
        await certificateService_1.certificateService.softDelete((0, params_1.getParam)(req, 'id'), req.user._id.toString());
        res.json(ApiResponse_1.ApiResponse.success('Certificate deleted'));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCertificate = deleteCertificate;
const downloadCertificate = async (req, res, next) => {
    try {
        const cert = await certificateService_1.certificateService.getById((0, params_1.getParam)(req, 'id'));
        if (!cert.certificateFile?.path) {
            res.status(404).json(ApiResponse_1.ApiResponse.success('No file attached'));
            return;
        }
        const filePath = storage_1.storageService.getAbsolutePath(cert.certificateFile.path);
        res.download(filePath, cert.certificateFile.originalName);
    }
    catch (error) {
        next(error);
    }
};
exports.downloadCertificate = downloadCertificate;
const getCertificateDashboard = async (req, res, next) => {
    try {
        const stats = await certificateService_1.certificateService.getDashboardStats();
        res.json(ApiResponse_1.ApiResponse.success('Dashboard stats retrieved', stats));
    }
    catch (error) {
        next(error);
    }
};
exports.getCertificateDashboard = getCertificateDashboard;
const exportCertificatesExcel = async (req, res, next) => {
    try {
        const certs = await certificateService_1.certificateService.getExportData({
            search: req.query.search,
            category: req.query.category,
            status: req.query.status,
        });
        const rows = certs.map((c) => ({
            certificateId: c.certificateId,
            certificateNumber: c.certificateNumber,
            certificateName: c.certificateName,
            category: c.category,
            issueDate: c.issueDate?.toLocaleDateString(),
            expiryDate: c.expiryDate?.toLocaleDateString(),
            status: c.status,
            issuingAuthority: c.issuingAuthority,
        }));
        await (0, helpers_1.exportToExcel)(res, `certificates-${Date.now()}`, [
            { header: 'Certificate ID', key: 'certificateId', width: 18 },
            { header: 'Number', key: 'certificateNumber', width: 15 },
            { header: 'Name', key: 'certificateName', width: 25 },
            { header: 'Category', key: 'category', width: 15 },
            { header: 'Issue Date', key: 'issueDate', width: 12 },
            { header: 'Expiry Date', key: 'expiryDate', width: 12 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Issuing Authority', key: 'issuingAuthority', width: 20 },
        ], rows);
    }
    catch (error) {
        next(error);
    }
};
exports.exportCertificatesExcel = exportCertificatesExcel;
const exportCertificatesPdf = async (req, res, next) => {
    try {
        const certs = await certificateService_1.certificateService.getExportData({
            search: req.query.search,
            category: req.query.category,
            status: req.query.status,
        });
        (0, helpers_1.exportToPdf)(res, `certificates-${Date.now()}`, 'Certificate Report', ['ID', 'Name', 'Category', 'Expiry', 'Status'], certs.map((c) => [
            c.certificateId,
            c.certificateName,
            c.category,
            c.expiryDate?.toLocaleDateString() || '',
            c.status,
        ]));
    }
    catch (error) {
        next(error);
    }
};
exports.exportCertificatesPdf = exportCertificatesPdf;
//# sourceMappingURL=certificateController.js.map