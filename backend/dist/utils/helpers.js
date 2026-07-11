"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateVehicleStatus = exports.calculateCertificateStatus = exports.calculateDelayStatus = exports.calculateProjectProgress = exports.generateProjectAssignmentId = exports.generateAssignmentId = exports.generateVehicleId = exports.generateCertificateId = exports.exportToPdf = exports.exportToExcel = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const exportToExcel = async (res, filename, columns, rows) => {
    const workbook = new exceljs_1.default.Workbook();
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
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
    await workbook.xlsx.write(res);
    res.end();
};
exports.exportToExcel = exportToExcel;
const exportToPdf = (res, filename, title, columns, rows) => {
    const doc = new pdfkit_1.default({ margin: 40, size: 'A4', layout: 'landscape' });
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
exports.exportToPdf = exportToPdf;
const generateCertificateId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `CERT-${year}-${random}`;
};
exports.generateCertificateId = generateCertificateId;
const generateVehicleId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `VEH-${year}-${random}`;
};
exports.generateVehicleId = generateVehicleId;
const generateAssignmentId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `ASG-${year}-${random}`;
};
exports.generateAssignmentId = generateAssignmentId;
const generateProjectAssignmentId = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `PRJ-ASG-${year}-${random}`;
};
exports.generateProjectAssignmentId = generateProjectAssignmentId;
const calculateProjectProgress = (milestones, progressUpdates) => {
    const milestoneAvg = milestones.length > 0
        ? milestones.reduce((sum, m) => sum + (m.progressPercent || 0), 0) / milestones.length
        : 0;
    const sorted = [...progressUpdates].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    const latestProgress = sorted[0]?.progressPercent || 0;
    if (milestones.length > 0 && progressUpdates.length > 0) {
        return Math.round((milestoneAvg + latestProgress) / 2);
    }
    if (milestones.length > 0)
        return Math.round(milestoneAvg);
    if (progressUpdates.length > 0)
        return Math.round(latestProgress);
    return 0;
};
exports.calculateProjectProgress = calculateProjectProgress;
const calculateDelayStatus = (plannedProgress, actualProgress) => {
    const diff = actualProgress - plannedProgress;
    if (diff >= 10)
        return 'Ahead';
    if (diff >= -5)
        return 'On Track';
    if (diff >= -15)
        return 'At Risk';
    return 'Delayed';
};
exports.calculateDelayStatus = calculateDelayStatus;
const calculateCertificateStatus = (expiryDate, currentStatus) => {
    if (currentStatus === 'Archived' || currentStatus === 'Renewed') {
        return currentStatus;
    }
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 0)
        return 'Expired';
    if (daysUntilExpiry <= 30)
        return 'Expiring Soon';
    return 'Active';
};
exports.calculateCertificateStatus = calculateCertificateStatus;
const calculateVehicleStatus = (vehicle) => {
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
    if (vehicle.isAssigned)
        return 'Assigned';
    return 'Available';
};
exports.calculateVehicleStatus = calculateVehicleStatus;
//# sourceMappingURL=helpers.js.map