"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateService = exports.CertificateService = void 0;
const Certificate_1 = require("../models/Certificate");
const User_1 = require("../models/User");
const ApiResponse_1 = require("../utils/ApiResponse");
const pagination_1 = require("../utils/pagination");
const helpers_1 = require("../utils/helpers");
const storage_1 = require("../utils/storage");
const notificationService_1 = require("./notificationService");
const emailService_1 = require("./emailService");
class CertificateService {
    constructor() {
        this.populateFields = [
            { path: 'relatedEmployee', select: 'firstName lastName email employeeId' },
            { path: 'relatedEquipment', select: 'name equipmentId' },
            { path: 'relatedVehicle', select: 'vehicleName registrationNumber vehicleId' },
            { path: 'relatedProject', select: 'name code' },
            { path: 'createdBy', select: 'firstName lastName email' },
            { path: 'updatedBy', select: 'firstName lastName email' },
        ];
    }
    buildFilter(filters) {
        const query = { isDeleted: false };
        if (filters.search) {
            const regex = new RegExp((0, pagination_1.escapeRegex)(filters.search), 'i');
            query.$or = [
                { certificateName: regex },
                { certificateNumber: regex },
                { certificateId: regex },
                { issuingAuthority: regex },
            ];
        }
        if (filters.category)
            query.category = filters.category;
        if (filters.status)
            query.status = filters.status;
        if (filters.relatedEmployee)
            query.relatedEmployee = filters.relatedEmployee;
        if (filters.relatedEquipment)
            query.relatedEquipment = filters.relatedEquipment;
        if (filters.relatedVehicle)
            query.relatedVehicle = filters.relatedVehicle;
        if (filters.relatedProject)
            query.relatedProject = filters.relatedProject;
        if (filters.expiryFrom || filters.expiryTo) {
            const expiryDate = {};
            if (filters.expiryFrom)
                expiryDate.$gte = new Date(filters.expiryFrom);
            if (filters.expiryTo)
                expiryDate.$lte = new Date(filters.expiryTo);
            query.expiryDate = expiryDate;
        }
        return query;
    }
    async getAll(filters, pagination) {
        const query = this.buildFilter(filters);
        const sort = (0, pagination_1.buildSort)(pagination.sortBy, pagination.sortOrder);
        const [data, total] = await Promise.all([
            Certificate_1.Certificate.find(query)
                .populate(this.populateFields)
                .sort(sort)
                .skip((pagination.page - 1) * pagination.limit)
                .limit(pagination.limit),
            Certificate_1.Certificate.countDocuments(query),
        ]);
        return {
            data,
            pagination: (0, pagination_1.buildPaginationMeta)(pagination.page, pagination.limit, total),
        };
    }
    async getById(id) {
        const cert = await Certificate_1.Certificate.findOne({ _id: id, isDeleted: false }).populate(this.populateFields);
        if (!cert)
            throw new ApiResponse_1.ApiError(404, 'Certificate not found');
        return cert;
    }
    async create(input, file) {
        const status = (0, helpers_1.calculateCertificateStatus)(input.expiryDate);
        const certData = {
            certificateId: (0, helpers_1.generateCertificateId)(),
            ...input,
            status: status,
        };
        if (file) {
            certData.certificateFile = storage_1.storageService.storeFile(file, 'certificates');
        }
        const cert = await Certificate_1.Certificate.create(certData);
        return cert.populate(this.populateFields);
    }
    async update(id, input, updatedBy, file) {
        const cert = await Certificate_1.Certificate.findOne({ _id: id, isDeleted: false });
        if (!cert)
            throw new ApiResponse_1.ApiError(404, 'Certificate not found');
        if (file) {
            if (cert.certificateFile?.path) {
                storage_1.storageService.deleteFile(cert.certificateFile.path);
            }
            cert.certificateFile = storage_1.storageService.storeFile(file, 'certificates');
        }
        Object.assign(cert, input, { updatedBy });
        if (input.expiryDate) {
            cert.status = (0, helpers_1.calculateCertificateStatus)(input.expiryDate, cert.status);
        }
        await cert.save();
        return cert.populate(this.populateFields);
    }
    async softDelete(id, deletedBy) {
        const cert = await Certificate_1.Certificate.findOne({ _id: id, isDeleted: false });
        if (!cert)
            throw new ApiResponse_1.ApiError(404, 'Certificate not found');
        cert.isDeleted = true;
        cert.deletedAt = new Date();
        cert.deletedBy = deletedBy;
        await cert.save();
    }
    async getDashboardStats() {
        const now = new Date();
        const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const baseFilter = { isDeleted: false };
        const [total, active, expired, expiring7, expiring30, byCategory, byStatus, upcomingRenewals, recentlyAdded,] = await Promise.all([
            Certificate_1.Certificate.countDocuments(baseFilter),
            Certificate_1.Certificate.countDocuments({ ...baseFilter, status: 'Active' }),
            Certificate_1.Certificate.countDocuments({ ...baseFilter, status: 'Expired' }),
            Certificate_1.Certificate.countDocuments({
                ...baseFilter,
                expiryDate: { $gte: now, $lte: in7Days },
                status: { $nin: ['Archived', 'Renewed'] },
            }),
            Certificate_1.Certificate.countDocuments({
                ...baseFilter,
                expiryDate: { $gte: now, $lte: in30Days },
                status: { $nin: ['Archived', 'Renewed'] },
            }),
            Certificate_1.Certificate.aggregate([
                { $match: baseFilter },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            Certificate_1.Certificate.aggregate([
                { $match: baseFilter },
                { $group: { _id: '$status', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            Certificate_1.Certificate.find({
                ...baseFilter,
                renewalDate: { $gte: now, $lte: in30Days },
            })
                .populate('relatedEmployee', 'firstName lastName')
                .sort({ renewalDate: 1 })
                .limit(10),
            Certificate_1.Certificate.find(baseFilter)
                .populate('createdBy', 'firstName lastName')
                .sort({ createdAt: -1 })
                .limit(10),
        ]);
        return {
            total,
            active,
            expired,
            expiringWithin7Days: expiring7,
            expiringWithin30Days: expiring30,
            byCategory: byCategory.map((c) => ({ category: c._id, count: c.count })),
            byStatus: byStatus.map((s) => ({ status: s._id, count: s.count })),
            upcomingRenewals,
            recentlyAdded,
        };
    }
    async updateExpiryStatuses() {
        const certs = await Certificate_1.Certificate.find({
            isDeleted: false,
            status: { $nin: ['Archived', 'Renewed'] },
        });
        let updated = 0;
        for (const cert of certs) {
            const newStatus = (0, helpers_1.calculateCertificateStatus)(cert.expiryDate, cert.status);
            if (newStatus !== cert.status) {
                cert.status = newStatus;
                await cert.save();
                updated++;
            }
        }
        return updated;
    }
    async sendExpiryReminders(reminderDays) {
        let sent = 0;
        const now = new Date();
        for (const days of reminderDays) {
            const targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
            const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
            const expiringCerts = await Certificate_1.Certificate.find({
                isDeleted: false,
                status: { $in: ['Active', 'Expiring Soon'] },
                expiryDate: { $gte: startOfDay, $lte: endOfDay },
            }).populate('relatedEmployee createdBy');
            for (const cert of expiringCerts) {
                const admins = await User_1.User.find({
                    role: { $in: ['super_admin', 'admin', 'manager'] },
                    isActive: true,
                });
                const recipients = new Set();
                admins.forEach((a) => recipients.add(a._id.toString()));
                if (cert.relatedEmployee) {
                    recipients.add(cert.relatedEmployee._id.toString());
                }
                for (const userId of recipients) {
                    const user = await User_1.User.findById(userId);
                    if (!user)
                        continue;
                    await notificationService_1.notificationService.create({
                        user: userId,
                        title: `Certificate Expiring in ${days} day(s)`,
                        message: `Certificate "${cert.certificateName}" (${cert.certificateId}) expires on ${cert.expiryDate.toLocaleDateString()}`,
                        type: 'certificate_expiry',
                        relatedEntity: { entityType: 'Certificate', entityId: cert._id },
                        metadata: { daysRemaining: days },
                    });
                    await (0, emailService_1.sendCertificateExpiryEmail)(user.email, cert.certificateName, cert.expiryDate, days);
                    sent++;
                }
            }
        }
        return sent;
    }
    async getExportData(filters) {
        const query = this.buildFilter(filters);
        return Certificate_1.Certificate.find(query)
            .populate(this.populateFields)
            .sort({ expiryDate: 1 });
    }
}
exports.CertificateService = CertificateService;
exports.certificateService = new CertificateService();
//# sourceMappingURL=certificateService.js.map