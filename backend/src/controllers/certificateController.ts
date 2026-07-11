import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { certificateService } from '../services/certificateService';
import { ApiResponse } from '../utils/ApiResponse';
import { getPagination } from '../utils/pagination';
import { exportToExcel, exportToPdf } from '../utils/helpers';
import { storageService } from '../utils/storage';
import { getParam } from '../utils/params';

export const getCertificates = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await certificateService.getAll(
      {
        search: req.query.search as string,
        category: req.query.category as string,
        status: req.query.status as string,
        relatedEmployee: req.query.relatedEmployee as string,
        relatedEquipment: req.query.relatedEquipment as string,
        relatedVehicle: req.query.relatedVehicle as string,
        relatedProject: req.query.relatedProject as string,
        expiryFrom: req.query.expiryFrom as string,
        expiryTo: req.query.expiryTo as string,
      },
      getPagination(req),
    );
    res.json(ApiResponse.success('Certificates retrieved', result.data, { pagination: result.pagination }));
  } catch (error) {
    next(error);
  }
};

export const getCertificate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cert = await certificateService.getById(getParam(req, 'id'));
    res.json(ApiResponse.success('Certificate retrieved', cert));
  } catch (error) {
    next(error);
  }
};

export const createCertificate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cert = await certificateService.create(
      { ...req.body, createdBy: req.user!._id.toString() },
      req.file,
    );
    res.status(201).json(ApiResponse.success('Certificate created', cert));
  } catch (error) {
    next(error);
  }
};

export const updateCertificate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cert = await certificateService.update(
      getParam(req, 'id'),
      req.body,
      req.user!._id.toString(),
      req.file,
    );
    res.json(ApiResponse.success('Certificate updated', cert));
  } catch (error) {
    next(error);
  }
};

export const deleteCertificate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await certificateService.softDelete(getParam(req, 'id'), req.user!._id.toString());
    res.json(ApiResponse.success('Certificate deleted'));
  } catch (error) {
    next(error);
  }
};

export const downloadCertificate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const cert = await certificateService.getById(getParam(req, 'id'));
    if (!cert.certificateFile?.path) {
      res.status(404).json(ApiResponse.success('No file attached'));
      return;
    }
    const filePath = storageService.getAbsolutePath(cert.certificateFile.path);
    res.download(filePath, cert.certificateFile.originalName);
  } catch (error) {
    next(error);
  }
};

export const getCertificateDashboard = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await certificateService.getDashboardStats();
    res.json(ApiResponse.success('Dashboard stats retrieved', stats));
  } catch (error) {
    next(error);
  }
};

export const exportCertificatesExcel = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const certs = await certificateService.getExportData({
      search: req.query.search as string,
      category: req.query.category as string,
      status: req.query.status as string,
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

    await exportToExcel(
      res,
      `certificates-${Date.now()}`,
      [
        { header: 'Certificate ID', key: 'certificateId', width: 18 },
        { header: 'Number', key: 'certificateNumber', width: 15 },
        { header: 'Name', key: 'certificateName', width: 25 },
        { header: 'Category', key: 'category', width: 15 },
        { header: 'Issue Date', key: 'issueDate', width: 12 },
        { header: 'Expiry Date', key: 'expiryDate', width: 12 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Issuing Authority', key: 'issuingAuthority', width: 20 },
      ],
      rows,
    );
  } catch (error) {
    next(error);
  }
};

export const exportCertificatesPdf = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const certs = await certificateService.getExportData({
      search: req.query.search as string,
      category: req.query.category as string,
      status: req.query.status as string,
    });

    exportToPdf(
      res,
      `certificates-${Date.now()}`,
      'Certificate Report',
      ['ID', 'Name', 'Category', 'Expiry', 'Status'],
      certs.map((c) => [
        c.certificateId,
        c.certificateName,
        c.category,
        c.expiryDate?.toLocaleDateString() || '',
        c.status,
      ]),
    );
  } catch (error) {
    next(error);
  }
};
