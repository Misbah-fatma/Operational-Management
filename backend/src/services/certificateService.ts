import { Certificate, ICertificate } from '../models/Certificate';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiResponse';
import {
  PaginationOptions,
  PaginatedResult,
  buildPaginationMeta,
  buildSort,
  escapeRegex,
} from '../utils/pagination';
import {
  generateCertificateId,
  calculateCertificateStatus,
} from '../utils/helpers';
import { storageService } from '../utils/storage';
import { notificationService } from './notificationService';
import { sendCertificateExpiryEmail } from './emailService';

export interface CertificateFilters {
  search?: string;
  category?: string;
  status?: string;
  relatedEmployee?: string;
  relatedEquipment?: string;
  relatedVehicle?: string;
  relatedProject?: string;
  expiryFrom?: string;
  expiryTo?: string;
}

export interface CreateCertificateInput {
  certificateNumber: string;
  certificateName: string;
  category: ICertificate['category'];
  relatedEmployee?: string;
  relatedEquipment?: string;
  relatedVehicle?: string;
  relatedProject?: string;
  issueDate: Date;
  expiryDate: Date;
  renewalDate?: Date;
  issuingAuthority: string;
  remarks?: string;
  createdBy: string;
}

export class CertificateService {
  private buildFilter(filters: CertificateFilters): Record<string, unknown> {
    const query: Record<string, unknown> = { isDeleted: false };

    if (filters.search) {
      const regex = new RegExp(escapeRegex(filters.search), 'i');
      query.$or = [
        { certificateName: regex },
        { certificateNumber: regex },
        { certificateId: regex },
        { issuingAuthority: regex },
      ];
    }
    if (filters.category) query.category = filters.category;
    if (filters.status) query.status = filters.status;
    if (filters.relatedEmployee) query.relatedEmployee = filters.relatedEmployee;
    if (filters.relatedEquipment) query.relatedEquipment = filters.relatedEquipment;
    if (filters.relatedVehicle) query.relatedVehicle = filters.relatedVehicle;
    if (filters.relatedProject) query.relatedProject = filters.relatedProject;

    if (filters.expiryFrom || filters.expiryTo) {
      const expiryDate: Record<string, Date> = {};
      if (filters.expiryFrom) expiryDate.$gte = new Date(filters.expiryFrom);
      if (filters.expiryTo) expiryDate.$lte = new Date(filters.expiryTo);
      query.expiryDate = expiryDate;
    }

    return query;
  }

  private populateFields = [
    { path: 'relatedEmployee', select: 'firstName lastName email employeeId' },
    { path: 'relatedEquipment', select: 'name equipmentId' },
    { path: 'relatedVehicle', select: 'vehicleName registrationNumber vehicleId' },
    { path: 'relatedProject', select: 'name code' },
    { path: 'createdBy', select: 'firstName lastName email' },
    { path: 'updatedBy', select: 'firstName lastName email' },
  ];

  async getAll(
    filters: CertificateFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<ICertificate>> {
    const query = this.buildFilter(filters);
    const sort = buildSort(pagination.sortBy, pagination.sortOrder);

    const [data, total] = await Promise.all([
      Certificate.find(query)
        .populate(this.populateFields)
        .sort(sort)
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit),
      Certificate.countDocuments(query),
    ]);

    return {
      data,
      pagination: buildPaginationMeta(pagination.page, pagination.limit, total),
    };
  }

  async getById(id: string): Promise<ICertificate> {
    const cert = await Certificate.findOne({ _id: id, isDeleted: false }).populate(
      this.populateFields,
    );
    if (!cert) throw new ApiError(404, 'Certificate not found');
    return cert;
  }

  async create(
    input: CreateCertificateInput,
    file?: Express.Multer.File,
  ): Promise<ICertificate> {
    const status = calculateCertificateStatus(input.expiryDate);

    const certData: Record<string, unknown> = {
      certificateId: generateCertificateId(),
      ...input,
      status: status as ICertificate['status'],
    };

    if (file) {
      certData.certificateFile = storageService.storeFile(file, 'certificates');
    }

    const cert = await Certificate.create(certData);
    return cert.populate(this.populateFields);
  }

  async update(
    id: string,
    input: Partial<CreateCertificateInput>,
    updatedBy: string,
    file?: Express.Multer.File,
  ): Promise<ICertificate> {
    const cert = await Certificate.findOne({ _id: id, isDeleted: false });
    if (!cert) throw new ApiError(404, 'Certificate not found');

    if (file) {
      if (cert.certificateFile?.path) {
        storageService.deleteFile(cert.certificateFile.path);
      }
      cert.certificateFile = storageService.storeFile(file, 'certificates');
    }

    Object.assign(cert, input, { updatedBy });

    if (input.expiryDate) {
      cert.status = calculateCertificateStatus(
        input.expiryDate,
        cert.status,
      ) as ICertificate['status'];
    }

    await cert.save();
    return cert.populate(this.populateFields);
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const cert = await Certificate.findOne({ _id: id, isDeleted: false });
    if (!cert) throw new ApiError(404, 'Certificate not found');

    cert.isDeleted = true;
    cert.deletedAt = new Date();
    cert.deletedBy = deletedBy as unknown as ICertificate['deletedBy'];
    await cert.save();
  }

  async getDashboardStats() {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const baseFilter = { isDeleted: false };

    const [
      total,
      active,
      expired,
      expiring7,
      expiring30,
      byCategory,
      byStatus,
      upcomingRenewals,
      recentlyAdded,
    ] = await Promise.all([
      Certificate.countDocuments(baseFilter),
      Certificate.countDocuments({ ...baseFilter, status: 'Active' }),
      Certificate.countDocuments({ ...baseFilter, status: 'Expired' }),
      Certificate.countDocuments({
        ...baseFilter,
        expiryDate: { $gte: now, $lte: in7Days },
        status: { $nin: ['Archived', 'Renewed'] },
      }),
      Certificate.countDocuments({
        ...baseFilter,
        expiryDate: { $gte: now, $lte: in30Days },
        status: { $nin: ['Archived', 'Renewed'] },
      }),
      Certificate.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Certificate.aggregate([
        { $match: baseFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Certificate.find({
        ...baseFilter,
        renewalDate: { $gte: now, $lte: in30Days },
      })
        .populate('relatedEmployee', 'firstName lastName')
        .sort({ renewalDate: 1 })
        .limit(10),
      Certificate.find(baseFilter)
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

  async updateExpiryStatuses(): Promise<number> {
    const certs = await Certificate.find({
      isDeleted: false,
      status: { $nin: ['Archived', 'Renewed'] },
    });

    let updated = 0;
    for (const cert of certs) {
      const newStatus = calculateCertificateStatus(cert.expiryDate, cert.status);
      if (newStatus !== cert.status) {
        cert.status = newStatus as ICertificate['status'];
        await cert.save();
        updated++;
      }
    }
    return updated;
  }

  async sendExpiryReminders(reminderDays: number[]): Promise<number> {
    let sent = 0;
    const now = new Date();

    for (const days of reminderDays) {
      const targetDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      const expiringCerts = await Certificate.find({
        isDeleted: false,
        status: { $in: ['Active', 'Expiring Soon'] },
        expiryDate: { $gte: startOfDay, $lte: endOfDay },
      }).populate('relatedEmployee createdBy');

      for (const cert of expiringCerts) {
        const admins = await User.find({
          role: { $in: ['super_admin', 'admin', 'manager'] },
          isActive: true,
        });

        const recipients = new Set<string>();
        admins.forEach((a) => recipients.add(a._id.toString()));
        if (cert.relatedEmployee) {
          recipients.add((cert.relatedEmployee as { _id: { toString: () => string } })._id.toString());
        }

        for (const userId of recipients) {
          const user = await User.findById(userId);
          if (!user) continue;

          await notificationService.create({
            user: userId,
            title: `Certificate Expiring in ${days} day(s)`,
            message: `Certificate "${cert.certificateName}" (${cert.certificateId}) expires on ${cert.expiryDate.toLocaleDateString()}`,
            type: 'certificate_expiry',
            relatedEntity: { entityType: 'Certificate', entityId: cert._id },
            metadata: { daysRemaining: days },
          });

          await sendCertificateExpiryEmail(
            user.email,
            cert.certificateName,
            cert.expiryDate,
            days,
          );
          sent++;
        }
      }
    }
    return sent;
  }

  async getExportData(filters: CertificateFilters) {
    const query = this.buildFilter(filters);
    return Certificate.find(query)
      .populate(this.populateFields)
      .sort({ expiryDate: 1 });
  }
}

export const certificateService = new CertificateService();
