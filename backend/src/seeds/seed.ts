import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Equipment } from '../models/Equipment';
import { Certificate } from '../models/Certificate';
import { Vehicle } from '../models/Vehicle';
import { Milestone } from '../models/Milestone';
import { ProjectAssignment } from '../models/ProjectAssignment';
import { ProjectProgress } from '../models/ProjectProgress';
import { ProjectFinancial } from '../models/ProjectFinancial';
import { ProjectIssue } from '../models/ProjectIssue';
import { ProjectTeam } from '../models/ProjectTeam';
import { ProjectPlanningItem } from '../models/ProjectPlanningItem';
import { ROLES } from '../constants';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/operational_management';

const now = new Date();
const addDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
const monthDate = (year: number, month: number, day = 15) => new Date(year, month - 1, day);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Equipment.deleteMany({}),
    Certificate.deleteMany({}),
    Vehicle.deleteMany({}),
    Milestone.deleteMany({}),
    ProjectAssignment.deleteMany({}),
    ProjectProgress.deleteMany({}),
    ProjectFinancial.deleteMany({}),
    ProjectIssue.deleteMany({}),
    ProjectTeam.deleteMany({}),
    ProjectPlanningItem.deleteMany({}),
  ]);

  const users = await User.create([
    {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@company.com',
      password: 'Admin@123',
      role: ROLES.SUPER_ADMIN,
      employeeId: 'EMP001',
      department: 'IT',
    },
    {
      firstName: 'John',
      lastName: 'Admin',
      email: 'admin@company.com',
      password: 'Admin@123',
      role: ROLES.ADMIN,
      employeeId: 'EMP002',
      department: 'Operations',
    },
    {
      firstName: 'Sarah',
      lastName: 'Manager',
      email: 'manager@company.com',
      password: 'Admin@123',
      role: ROLES.MANAGER,
      employeeId: 'EMP003',
      department: 'Operations',
    },
    {
      firstName: 'Mike',
      lastName: 'Engineer',
      email: 'engineer@company.com',
      password: 'Admin@123',
      role: ROLES.ENGINEER,
      employeeId: 'EMP004',
      department: 'Engineering',
    },
    {
      firstName: 'Tom',
      lastName: 'Technician',
      email: 'technician@company.com',
      password: 'Admin@123',
      role: ROLES.TECHNICIAN,
      employeeId: 'EMP005',
      department: 'Maintenance',
    },
    {
      firstName: 'David',
      lastName: 'Driver',
      email: 'driver@company.com',
      password: 'Admin@123',
      role: ROLES.DRIVER,
      employeeId: 'EMP006',
      department: 'Transport',
    },
    {
      firstName: 'Lisa',
      lastName: 'Viewer',
      email: 'viewer@company.com',
      password: 'Admin@123',
      role: ROLES.VIEWER,
      employeeId: 'EMP007',
      department: 'HR',
    },
  ]);

  const [superAdmin, , manager, engineer, technician, driver] = users;

  const projects = await Project.create([
    {
      name: 'Downtown Tower Construction',
      code: 'PRJ001',
      client: 'Metro Developers',
      contractNumber: 'CNT-2026-001',
      contractValue: 2500000,
      budget: 2500000,
      actualCost: 875000,
      location: 'Downtown',
      startDate: monthDate(2026, 1, 15),
      endDate: monthDate(2027, 6, 30),
      status: 'Active',
      progressPercent: 35,
      plannedProgressPercent: 40,
      actualProgressPercent: 35,
      delayStatus: 'At Risk',
      projectManager: manager._id,
      createdBy: superAdmin._id,
      isActive: true,
      updatedAt: monthDate(2026, 6, 20),
      createdAt: monthDate(2026, 1, 10),
    },
    {
      name: 'Highway Bridge Project',
      code: 'PRJ002',
      client: 'State Transport Authority',
      contractNumber: 'CNT-2026-002',
      contractValue: 1800000,
      budget: 1800000,
      actualCost: 270000,
      location: 'North District',
      startDate: monthDate(2026, 3, 1),
      endDate: monthDate(2027, 12, 31),
      status: 'Planning Stage',
      progressPercent: 15,
      plannedProgressPercent: 18,
      actualProgressPercent: 15,
      delayStatus: 'On Track',
      projectManager: manager._id,
      createdBy: superAdmin._id,
      isActive: true,
      updatedAt: monthDate(2026, 5, 10),
      createdAt: monthDate(2026, 2, 5),
    },
    {
      name: 'Industrial Park Development',
      code: 'PRJ003',
      client: 'Industrial Corp',
      contractNumber: 'CNT-2026-003',
      contractValue: 3200000,
      budget: 3200000,
      actualCost: 3150000,
      location: 'East Zone',
      startDate: monthDate(2025, 6, 1),
      endDate: monthDate(2026, 5, 31),
      status: 'Completed',
      progressPercent: 100,
      actualProgressPercent: 100,
      delayStatus: 'Ahead',
      projectManager: manager._id,
      createdBy: superAdmin._id,
      isActive: true,
      updatedAt: monthDate(2026, 5, 31),
      createdAt: monthDate(2025, 5, 15),
    },
    {
      name: 'Airport Terminal Expansion',
      code: 'PRJ004',
      client: 'Aviation Authority',
      contractNumber: 'CNT-2026-004',
      contractValue: 4500000,
      budget: 4500000,
      actualCost: 120000,
      location: 'International Airport',
      startDate: monthDate(2026, 8, 1),
      endDate: monthDate(2028, 12, 31),
      status: 'Proposal Stage',
      progressPercent: 5,
      delayStatus: 'On Track',
      projectManager: manager._id,
      createdBy: superAdmin._id,
      isActive: true,
      updatedAt: monthDate(2026, 4, 1),
      createdAt: monthDate(2026, 3, 20),
    },
    {
      name: 'Coastal Road Rehabilitation',
      code: 'PRJ005',
      client: 'City Municipality',
      contractNumber: 'CNT-2026-005',
      contractValue: 950000,
      budget: 950000,
      actualCost: 410000,
      location: 'Coastal District',
      startDate: monthDate(2026, 2, 1),
      endDate: monthDate(2026, 11, 30),
      status: 'Pending Execution',
      progressPercent: 22,
      plannedProgressPercent: 35,
      actualProgressPercent: 22,
      delayStatus: 'Delayed',
      projectManager: manager._id,
      createdBy: superAdmin._id,
      isActive: true,
      updatedAt: monthDate(2026, 6, 5),
      createdAt: monthDate(2026, 1, 25),
    },
    {
      name: 'Solar Farm Installation',
      code: 'PRJ006',
      client: 'Green Energy Ltd',
      contractNumber: 'CNT-2026-006',
      contractValue: 2100000,
      budget: 2100000,
      actualCost: 0,
      location: 'Desert Zone',
      startDate: monthDate(2026, 9, 1),
      endDate: monthDate(2027, 8, 31),
      status: 'Under Review',
      progressPercent: 0,
      delayStatus: 'On Track',
      projectManager: manager._id,
      createdBy: superAdmin._id,
      isActive: true,
      updatedAt: monthDate(2026, 6, 1),
      createdAt: monthDate(2026, 5, 28),
    },
    {
      name: 'Hospital Wing Renovation',
      code: 'PRJ007',
      client: 'Health Ministry',
      contractNumber: 'CNT-2026-007',
      contractValue: 680000,
      budget: 680000,
      actualCost: 195000,
      location: 'Central District',
      startDate: monthDate(2026, 4, 15),
      endDate: monthDate(2026, 12, 15),
      status: 'Active',
      progressPercent: 48,
      plannedProgressPercent: 45,
      actualProgressPercent: 48,
      delayStatus: 'Ahead',
      projectManager: manager._id,
      createdBy: superAdmin._id,
      isActive: true,
      updatedAt: monthDate(2026, 6, 18),
      createdAt: monthDate(2026, 4, 1),
    },
  ]);

  const [prj1, prj2, prj3, prj5, prj7] = projects;

  const equipment = await Equipment.create([
    { name: 'Tower Crane TC-500', equipmentId: 'EQ001', category: 'Crane', manufacturer: 'Liebherr' },
    { name: 'Excavator EX-200', equipmentId: 'EQ002', category: 'Excavator', manufacturer: 'Caterpillar' },
    { name: 'Concrete Mixer CM-100', equipmentId: 'EQ003', category: 'Mixer', manufacturer: 'Schwing' },
    { name: 'Bulldozer BD-300', equipmentId: 'EQ004', category: 'Bulldozer', manufacturer: 'Komatsu' },
  ]);

  const [eq1, eq2, eq3] = equipment;

  await Certificate.create([
    {
      certificateId: 'CERT-2026-10001',
      certificateNumber: 'ISO-9001-2024',
      certificateName: 'ISO 9001 Quality Management',
      category: 'Project',
      relatedProject: prj1._id,
      issueDate: addDays(-365),
      expiryDate: addDays(30),
      issuingAuthority: 'ISO Certification Body',
      status: 'Expiring Soon',
      createdBy: superAdmin._id,
    },
    {
      certificateId: 'CERT-2026-10002',
      certificateNumber: 'SAF-2024-001',
      certificateName: 'Safety Training Certificate',
      category: 'Employee',
      relatedEmployee: engineer._id,
      issueDate: addDays(-180),
      expiryDate: addDays(5),
      issuingAuthority: 'Safety Board',
      status: 'Expiring Soon',
      createdBy: manager._id,
    },
    {
      certificateId: 'CERT-2026-10003',
      certificateNumber: 'CAL-2025-050',
      certificateName: 'Equipment Calibration Certificate',
      category: 'Calibration',
      relatedEquipment: eq1._id,
      issueDate: addDays(-90),
      expiryDate: addDays(-10),
      issuingAuthority: 'Calibration Labs Inc',
      status: 'Expired',
      createdBy: manager._id,
    },
    {
      certificateId: 'CERT-2026-10004',
      certificateNumber: 'VND-2025-012',
      certificateName: 'Vendor Compliance Certificate',
      category: 'Vendor',
      issueDate: addDays(-200),
      expiryDate: addDays(160),
      issuingAuthority: 'Vendor Authority',
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      certificateId: 'CERT-2026-10005',
      certificateNumber: 'VEH-INS-2025',
      certificateName: 'Fleet Insurance Certificate',
      category: 'Vehicle',
      issueDate: addDays(-100),
      expiryDate: addDays(265),
      issuingAuthority: 'Insurance Corp',
      status: 'Active',
      createdBy: manager._id,
    },
    {
      certificateId: 'CERT-2026-10006',
      certificateNumber: 'ENV-2025-008',
      certificateName: 'Environmental Compliance',
      category: 'Project',
      relatedProject: prj2._id,
      issueDate: addDays(-120),
      expiryDate: addDays(240),
      issuingAuthority: 'Environmental Agency',
      status: 'Active',
      createdBy: manager._id,
    },
  ]);

  const vehicles = await Vehicle.create([
    {
      vehicleId: 'VEH-2026-1001',
      vehicleName: 'Toyota Hilux',
      registrationNumber: 'ABC-1234',
      make: 'Toyota',
      model: 'Hilux',
      year: 2023,
      vin: 'JTFRB22E500123456',
      insuranceNumber: 'INS-2025-001',
      insuranceExpiryDate: addDays(45),
      mvpiExpiryDate: addDays(90),
      currentKm: 45000,
      fuelType: 'Diesel',
      currentStatus: 'Assigned',
      createdBy: superAdmin._id,
    },
    {
      vehicleId: 'VEH-2026-1002',
      vehicleName: 'Ford Transit Van',
      registrationNumber: 'XYZ-5678',
      make: 'Ford',
      model: 'Transit',
      year: 2022,
      insuranceNumber: 'INS-2025-002',
      insuranceExpiryDate: addDays(15),
      mvpiExpiryDate: addDays(200),
      currentKm: 78000,
      fuelType: 'Diesel',
      currentStatus: 'Assigned',
      createdBy: superAdmin._id,
    },
    {
      vehicleId: 'VEH-2026-1003',
      vehicleName: 'Nissan Patrol',
      registrationNumber: 'DEF-9012',
      make: 'Nissan',
      model: 'Patrol',
      year: 2024,
      insuranceNumber: 'INS-2025-003',
      insuranceExpiryDate: addDays(180),
      mvpiExpiryDate: addDays(20),
      currentKm: 12000,
      fuelType: 'Petrol',
      currentStatus: 'Available',
      createdBy: manager._id,
    },
    {
      vehicleId: 'VEH-2026-1004',
      vehicleName: 'Isuzu Dump Truck',
      registrationNumber: 'GHI-3456',
      make: 'Isuzu',
      model: 'FVR',
      year: 2021,
      insuranceNumber: 'INS-2024-004',
      insuranceExpiryDate: addDays(-5),
      mvpiExpiryDate: addDays(60),
      currentKm: 120000,
      fuelType: 'Diesel',
      currentStatus: 'Insurance Expired',
      createdBy: manager._id,
    },
    {
      vehicleId: 'VEH-2026-1005',
      vehicleName: 'Mercedes Sprinter',
      registrationNumber: 'JKL-7890',
      make: 'Mercedes',
      model: 'Sprinter',
      year: 2023,
      insuranceNumber: 'INS-2025-005',
      insuranceExpiryDate: addDays(120),
      mvpiExpiryDate: addDays(150),
      currentKm: 32000,
      fuelType: 'Diesel',
      currentStatus: 'Under Maintenance',
      createdBy: manager._id,
    },
  ]);

  const [veh1, veh2, veh3] = vehicles;

  // Team members
  await ProjectTeam.create([
    { project: prj1._id, user: manager._id, role: 'manager', joinedDate: monthDate(2026, 1, 10), status: 'Active', createdBy: superAdmin._id },
    { project: prj1._id, user: engineer._id, role: 'engineer', joinedDate: monthDate(2026, 1, 15), status: 'Active', createdBy: superAdmin._id },
    { project: prj1._id, user: technician._id, role: 'technician', joinedDate: monthDate(2026, 1, 20), status: 'Active', createdBy: superAdmin._id },
    { project: prj2._id, user: manager._id, role: 'manager', joinedDate: monthDate(2026, 2, 1), status: 'Active', createdBy: superAdmin._id },
    { project: prj2._id, user: engineer._id, role: 'supervisor', joinedDate: monthDate(2026, 3, 1), status: 'Active', createdBy: superAdmin._id },
    { project: prj5._id, user: engineer._id, role: 'engineer', joinedDate: monthDate(2026, 2, 5), status: 'Active', createdBy: superAdmin._id },
    { project: prj7._id, user: technician._id, role: 'technician', joinedDate: monthDate(2026, 4, 10), status: 'Active', createdBy: superAdmin._id },
  ]);

  // Resource assignments (feeds Resource Allocation + Manpower charts)
  await ProjectAssignment.create([
    {
      assignmentId: 'ASG-001',
      project: prj1._id,
      resourceType: 'employee',
      employee: engineer._id,
      employeeRole: 'engineer',
      workPackage: 'Structural Works',
      assignmentDate: monthDate(2026, 1, 15),
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      assignmentId: 'ASG-002',
      project: prj1._id,
      resourceType: 'employee',
      employee: technician._id,
      employeeRole: 'technician',
      workPackage: 'MEP Installation',
      assignmentDate: monthDate(2026, 1, 20),
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      assignmentId: 'ASG-003',
      project: prj1._id,
      resourceType: 'employee',
      employee: driver._id,
      employeeRole: 'supervisor',
      workPackage: 'Site Logistics',
      assignmentDate: monthDate(2026, 2, 1),
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      assignmentId: 'ASG-004',
      project: prj2._id,
      resourceType: 'employee',
      employee: engineer._id,
      employeeRole: 'supervisor',
      workPackage: 'Bridge Design Review',
      assignmentDate: monthDate(2026, 3, 5),
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      assignmentId: 'ASG-005',
      project: prj5._id,
      resourceType: 'employee',
      employee: technician._id,
      employeeRole: 'technician',
      workPackage: 'Road Surface Prep',
      assignmentDate: monthDate(2026, 2, 10),
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      assignmentId: 'ASG-006',
      project: prj7._id,
      resourceType: 'employee',
      employee: engineer._id,
      employeeRole: 'engineer',
      workPackage: 'Renovation Phase 1',
      assignmentDate: monthDate(2026, 4, 15),
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      assignmentId: 'ASG-007',
      project: prj1._id,
      resourceType: 'vehicle',
      vehicle: veh1._id,
      workPackage: 'Material Transport',
      assignmentDate: monthDate(2026, 1, 15),
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      assignmentId: 'ASG-008',
      project: prj1._id,
      resourceType: 'vehicle',
      vehicle: veh2._id,
      workPackage: 'Crew Transport',
      assignmentDate: monthDate(2026, 2, 1),
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      assignmentId: 'ASG-009',
      project: prj5._id,
      resourceType: 'vehicle',
      vehicle: veh3._id,
      workPackage: 'Site Inspection',
      assignmentDate: monthDate(2026, 3, 1),
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      assignmentId: 'ASG-010',
      project: prj1._id,
      resourceType: 'equipment',
      equipment: eq1._id,
      workPackage: 'Tower Lifting',
      assignmentDate: monthDate(2026, 1, 10),
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      assignmentId: 'ASG-011',
      project: prj1._id,
      resourceType: 'equipment',
      equipment: eq2._id,
      workPackage: 'Foundation Excavation',
      assignmentDate: monthDate(2026, 1, 12),
      status: 'Active',
      createdBy: superAdmin._id,
    },
    {
      assignmentId: 'ASG-012',
      project: prj5._id,
      resourceType: 'equipment',
      equipment: eq3._id,
      workPackage: 'Concrete Pouring',
      assignmentDate: monthDate(2026, 3, 15),
      status: 'Active',
      createdBy: superAdmin._id,
    },
  ]);

  // Progress updates (feeds Monthly Progress Trend chart)
  const progressEntries = [
    { project: prj1._id, date: monthDate(2026, 1), progressPercent: 10, summary: 'Foundation work started' },
    { project: prj1._id, date: monthDate(2026, 2), progressPercent: 18, summary: 'Foundation complete, ground floor begun' },
    { project: prj1._id, date: monthDate(2026, 3), progressPercent: 25, summary: 'Ground floor structural work' },
    { project: prj1._id, date: monthDate(2026, 4), progressPercent: 30, summary: 'First floor slab poured' },
    { project: prj1._id, date: monthDate(2026, 5), progressPercent: 33, summary: 'MEP rough-in started' },
    { project: prj1._id, date: monthDate(2026, 6), progressPercent: 35, summary: 'Facade work initiated' },
    { project: prj2._id, date: monthDate(2026, 3), progressPercent: 5, summary: 'Site survey completed' },
    { project: prj2._id, date: monthDate(2026, 4), progressPercent: 10, summary: 'Design review in progress' },
    { project: prj2._id, date: monthDate(2026, 5), progressPercent: 12, summary: 'Permits submitted' },
    { project: prj2._id, date: monthDate(2026, 6), progressPercent: 15, summary: 'Planning phase 80% complete' },
    { project: prj5._id, date: monthDate(2026, 3), progressPercent: 8, summary: 'Mobilization started' },
    { project: prj5._id, date: monthDate(2026, 4), progressPercent: 14, summary: 'Demolition of old surface' },
    { project: prj5._id, date: monthDate(2026, 5), progressPercent: 18, summary: 'Sub-base preparation' },
    { project: prj5._id, date: monthDate(2026, 6), progressPercent: 22, summary: 'Asphalt layer partial' },
    { project: prj7._id, date: monthDate(2026, 4), progressPercent: 20, summary: 'Wing closure and safety setup' },
    { project: prj7._id, date: monthDate(2026, 5), progressPercent: 35, summary: 'Interior demolition complete' },
    { project: prj7._id, date: monthDate(2026, 6), progressPercent: 48, summary: 'New HVAC installation underway' },
    { project: prj3._id, date: monthDate(2025, 10), progressPercent: 60, summary: 'Building envelope complete' },
    { project: prj3._id, date: monthDate(2025, 12), progressPercent: 80, summary: 'Landscaping and utilities' },
    { project: prj3._id, date: monthDate(2026, 3), progressPercent: 95, summary: 'Final inspections' },
    { project: prj3._id, date: monthDate(2026, 5), progressPercent: 100, summary: 'Project handover complete' },
  ];

  await ProjectProgress.create(
    progressEntries.map((entry) => ({
      ...entry,
      updateType: 'monthly' as const,
      attachments: [],
      createdBy: manager._id,
    })),
  );

  // Financial records (feeds Cost vs Budget chart + outstanding payments)
  await ProjectFinancial.create([
    {
      project: prj1._id,
      budget: 2500000,
      actualCost: 875000,
      outstandingPayments: 150000,
      invoices: [
        { invoiceNumber: 'INV-PRJ001-01', amount: 500000, date: monthDate(2026, 2), status: 'Paid' },
        { invoiceNumber: 'INV-PRJ001-02', amount: 375000, date: monthDate(2026, 4), status: 'Paid' },
        { invoiceNumber: 'INV-PRJ001-03', amount: 150000, date: monthDate(2026, 6), status: 'Pending' },
      ],
      createdBy: superAdmin._id,
    },
    {
      project: prj2._id,
      budget: 1800000,
      actualCost: 270000,
      outstandingPayments: 85000,
      invoices: [
        { invoiceNumber: 'INV-PRJ002-01', amount: 185000, date: monthDate(2026, 4), status: 'Paid' },
        { invoiceNumber: 'INV-PRJ002-02', amount: 85000, date: monthDate(2026, 6), status: 'Overdue' },
      ],
      createdBy: superAdmin._id,
    },
    {
      project: prj3._id,
      budget: 3200000,
      actualCost: 3150000,
      outstandingPayments: 0,
      invoices: [
        { invoiceNumber: 'INV-PRJ003-01', amount: 1600000, date: monthDate(2025, 10), status: 'Paid' },
        { invoiceNumber: 'INV-PRJ003-02', amount: 1550000, date: monthDate(2026, 4), status: 'Paid' },
      ],
      createdBy: superAdmin._id,
    },
    {
      project: prj5._id,
      budget: 950000,
      actualCost: 410000,
      outstandingPayments: 62000,
      invoices: [
        { invoiceNumber: 'INV-PRJ005-01', amount: 348000, date: monthDate(2026, 4), status: 'Paid' },
        { invoiceNumber: 'INV-PRJ005-02', amount: 62000, date: monthDate(2026, 6), status: 'Pending' },
      ],
      createdBy: superAdmin._id,
    },
    {
      project: prj7._id,
      budget: 680000,
      actualCost: 195000,
      outstandingPayments: 45000,
      invoices: [
        { invoiceNumber: 'INV-PRJ007-01', amount: 150000, date: monthDate(2026, 5), status: 'Paid' },
        { invoiceNumber: 'INV-PRJ007-02', amount: 45000, date: monthDate(2026, 6), status: 'Pending' },
      ],
      createdBy: superAdmin._id,
    },
  ]);

  // RFIs and NCRs (feeds executive dashboard counters)
  await ProjectIssue.create([
    {
      project: prj1._id,
      type: 'RFI',
      title: 'Clarification on structural steel specifications',
      description: 'Need confirmation on grade and coating for exterior columns.',
      status: 'Open',
      createdBy: engineer._id,
    },
    {
      project: prj1._id,
      type: 'RFI',
      title: 'MEP routing through core walls',
      description: 'Request approval for revised duct routing on levels 3-5.',
      status: 'Open',
      createdBy: engineer._id,
    },
    {
      project: prj5._id,
      type: 'NCR',
      title: 'Sub-base compaction below specification',
      description: 'Compaction test results on section B failed minimum density requirement.',
      status: 'Open',
      createdBy: manager._id,
    },
    {
      project: prj7._id,
      type: 'NCR',
      title: 'Fire-rated door installation deviation',
      description: 'Doors on level 2 do not match approved shop drawings.',
      status: 'Closed',
      createdBy: manager._id,
    },
    {
      project: prj2._id,
      type: 'RFI',
      title: 'Bridge pier foundation depth',
      description: 'Geotechnical report suggests deeper foundations than design.',
      status: 'Closed',
      createdBy: engineer._id,
    },
  ]);

  // Milestones
  await Milestone.create([
    { project: prj1._id, name: 'Foundation Complete', plannedDate: monthDate(2026, 2, 28), actualDate: monthDate(2026, 3, 5), status: 'Completed', progressPercent: 100, createdBy: manager._id },
    { project: prj1._id, name: 'Structure Topping Out', plannedDate: monthDate(2026, 8, 31), status: 'In Progress', progressPercent: 40, createdBy: manager._id },
    { project: prj1._id, name: 'MEP Rough-In', plannedDate: monthDate(2026, 10, 31), status: 'Pending', progressPercent: 15, createdBy: manager._id },
    { project: prj2._id, name: 'Design Approval', plannedDate: monthDate(2026, 6, 30), status: 'In Progress', progressPercent: 70, createdBy: manager._id },
    { project: prj5._id, name: 'Phase 1 Road Section', plannedDate: monthDate(2026, 7, 31), status: 'Delayed', progressPercent: 30, createdBy: manager._id },
  ]);

  // Planning items
  await ProjectPlanningItem.create([
    { project: prj1._id, type: 'wbs', name: '1.0 Site Preparation', status: 'Completed', progressPercent: 100, createdBy: manager._id },
    { project: prj1._id, type: 'wbs', name: '2.0 Structural Frame', status: 'In Progress', progressPercent: 45, createdBy: manager._id },
    { project: prj1._id, type: 'deliverable', name: 'Structural Drawings Rev C', plannedDate: monthDate(2026, 3, 15), status: 'Completed', progressPercent: 100, createdBy: manager._id },
    { project: prj2._id, type: 'schedule', name: 'Permit Submission', plannedDate: monthDate(2026, 5, 1), status: 'Completed', progressPercent: 100, createdBy: manager._id },
    { project: prj2._id, type: 'schedule', name: 'Contractor Mobilization', plannedDate: monthDate(2026, 9, 1), status: 'Pending', progressPercent: 0, createdBy: manager._id },
  ]);

  console.log('\n✅ Seed data created successfully!\n');
  console.log('Demo data includes:');
  console.log('  • 7 projects across multiple statuses');
  console.log('  • 12 resource assignments (employees, vehicles, equipment)');
  console.log('  • 21 monthly progress updates');
  console.log('  • 5 financial records with invoices');
  console.log('  • 5 RFIs/NCRs');
  console.log('  • Team members, milestones, and planning items\n');
  console.log('Login credentials (password: Admin@123):');
  console.log('  superadmin@company.com - Super Admin');
  console.log('  admin@company.com      - Admin');
  console.log('  manager@company.com    - Manager');
  console.log('  engineer@company.com   - Engineer');
  console.log('  technician@company.com - Technician');
  console.log('  driver@company.com     - Driver');
  console.log('  viewer@company.com     - Viewer\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
