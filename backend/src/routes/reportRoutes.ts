import { Router } from 'express';
import * as reportController from '../controllers/reportController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validate } from '../middleware/validate';
import { reportQueryValidation, paginationValidation } from '../validators';
import { PERMISSIONS } from '../constants';

const router = Router();

router.use(authenticate);

router.get('/types', authorize(PERMISSIONS.REPORTS_READ), reportController.getReportTypes);

router.get(
  '/generate',
  authorize(PERMISSIONS.REPORTS_READ),
  validate([...reportQueryValidation, ...paginationValidation]),
  reportController.generateReport,
);

router.get(
  '/export/excel',
  authorize(PERMISSIONS.REPORTS_EXPORT),
  validate(reportQueryValidation),
  reportController.exportReportExcel,
);

router.get(
  '/export/pdf',
  authorize(PERMISSIONS.REPORTS_EXPORT),
  validate(reportQueryValidation),
  reportController.exportReportPdf,
);

export default router;
