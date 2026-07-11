import { Router } from 'express';
import * as certificateController from '../controllers/certificateController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { uploadCertificate, handleMulterError } from '../middleware/upload';
import { auditLog } from '../middleware/audit';
import {
  certificateValidation,
  idParamValidation,
  paginationValidation,
} from '../validators';
import { PERMISSIONS } from '../constants';

const router = Router();

router.use(authenticate);

router.get('/dashboard', authorize(PERMISSIONS.DASHBOARD_READ), certificateController.getCertificateDashboard);

router.get(
  '/export/excel',
  authorize(PERMISSIONS.CERTIFICATES_EXPORT),
  certificateController.exportCertificatesExcel,
);

router.get(
  '/export/pdf',
  authorize(PERMISSIONS.CERTIFICATES_EXPORT),
  certificateController.exportCertificatesPdf,
);

router.get(
  '/',
  authorize(PERMISSIONS.CERTIFICATES_READ),
  validate(paginationValidation),
  certificateController.getCertificates,
);

router.get(
  '/:id/download',
  authorize(PERMISSIONS.CERTIFICATES_READ),
  validate(idParamValidation),
  certificateController.downloadCertificate,
);

router.get(
  '/:id',
  authorize(PERMISSIONS.CERTIFICATES_READ),
  validate(idParamValidation),
  certificateController.getCertificate,
);

router.post(
  '/',
  authorize(PERMISSIONS.CERTIFICATES_CREATE),
  uploadCertificate,
  handleMulterError,
  validate(certificateValidation),
  auditLog('CREATE', 'Certificate'),
  certificateController.createCertificate,
);

router.put(
  '/:id',
  authorize(PERMISSIONS.CERTIFICATES_UPDATE),
  uploadCertificate,
  handleMulterError,
  validate([...idParamValidation, ...certificateValidation]),
  auditLog('UPDATE', 'Certificate'),
  certificateController.updateCertificate,
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.CERTIFICATES_DELETE),
  validate(idParamValidation),
  auditLog('DELETE', 'Certificate'),
  certificateController.deleteCertificate,
);

export default router;
