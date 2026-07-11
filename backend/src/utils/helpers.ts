import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Response } from 'express';

export const exportToExcel = async (
  res: Response,
  filename: string,
  columns: { header: string; key: string; width?: number }[],
  rows: Record<string, unknown>[],
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  worksheet.columns = columns.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width || 20,
  }));

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1976D2' },
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  rows.forEach((row) => worksheet.addRow(row));

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  );
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();
};

export const exportToPdf = (
  res: Response,
  filename: string,
  title: string,
  columns: string[],
  rows: string[][],
): void => {
  const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);

  doc.pipe(res);

  doc.fontSize(18).text(title, { align: 'center' });
  doc.moveDown();

  const colWidth = (doc.page.width - 80) / columns.length;
  let y = doc.y;

  doc.fontSize(10).font('Helvetica-Bold');
  columns.forEach((col, i) => {
    doc.text(col, 40 + i * colWidth, y, { width: colWidth - 5, ellipsis: true });
  });

  y += 20;
  doc.font('Helvetica');

  rows.forEach((row) => {
    if (y > doc.page.height - 60) {
      doc.addPage();
      y = 40;
    }
    row.forEach((cell, i) => {
      doc.text(String(cell ?? ''), 40 + i * colWidth, y, { width: colWidth - 5, ellipsis: true });
    });
    y += 18;
  });

  doc.end();
};

export const generateCertificateId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `CERT-${year}-${random}`;
};

export const generateVehicleId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VEH-${year}-${random}`;
};

export const generateAssignmentId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `ASG-${year}-${random}`;
};

export const generateProjectAssignmentId = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `PRJ-ASG-${year}-${random}`;
};

export const calculateProjectProgress = (
  milestones: { progressPercent: number }[],
  progressUpdates: { progressPercent: number; date?: Date }[],
): number => {
  const milestoneAvg =
    milestones.length > 0
      ? milestones.reduce((sum, m) => sum + (m.progressPercent || 0), 0) / milestones.length
      : 0;

  const sorted = [...progressUpdates].sort(
    (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime(),
  );
  const latestProgress = sorted[0]?.progressPercent || 0;

  if (milestones.length > 0 && progressUpdates.length > 0) {
    return Math.round((milestoneAvg + latestProgress) / 2);
  }
  if (milestones.length > 0) return Math.round(milestoneAvg);
  if (progressUpdates.length > 0) return Math.round(latestProgress);
  return 0;
};

export const calculateDelayStatus = (
  plannedProgress: number,
  actualProgress: number,
): string => {
  const diff = actualProgress - plannedProgress;
  if (diff >= 10) return 'Ahead';
  if (diff >= -5) return 'On Track';
  if (diff >= -15) return 'At Risk';
  return 'Delayed';
};

export const calculateCertificateStatus = (
  expiryDate: Date,
  currentStatus?: string,
): string => {
  if (currentStatus === 'Archived' || currentStatus === 'Renewed') {
    return currentStatus;
  }

  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return 'Expired';
  if (daysUntilExpiry <= 30) return 'Expiring Soon';
  return 'Active';
};

export const calculateVehicleStatus = (
  vehicle: {
    currentStatus: string;
    insuranceExpiryDate?: Date;
    mvpiExpiryDate?: Date;
    isAssigned?: boolean;
  },
): string => {
  if (vehicle.currentStatus === 'Inactive' || vehicle.currentStatus === 'Under Maintenance') {
    return vehicle.currentStatus;
  }

  const now = new Date();
  if (vehicle.insuranceExpiryDate && new Date(vehicle.insuranceExpiryDate) < now) {
    return 'Insurance Expired';
  }
  if (vehicle.mvpiExpiryDate && new Date(vehicle.mvpiExpiryDate) < now) {
    return 'MVPI Expired';
  }
  if (vehicle.isAssigned) return 'Assigned';
  return 'Available';
};
