"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
const Equipment_1 = require("../models/Equipment");
const Certificate_1 = require("../models/Certificate");
const Vehicle_1 = require("../models/Vehicle");
const constants_1 = require("../constants");
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '.env') });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/operational_management';
async function seed() {
    await mongoose_1.default.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    // Clear existing data
    await Promise.all([
        User_1.User.deleteMany({}),
        Project_1.Project.deleteMany({}),
        Equipment_1.Equipment.deleteMany({}),
        Certificate_1.Certificate.deleteMany({}),
        Vehicle_1.Vehicle.deleteMany({}),
    ]);
    // Create users for each role
    const users = await User_1.User.create([
        {
            firstName: 'Super',
            lastName: 'Admin',
            email: 'superadmin@company.com',
            password: 'Admin@123',
            role: constants_1.ROLES.SUPER_ADMIN,
            employeeId: 'EMP001',
            department: 'IT',
        },
        {
            firstName: 'John',
            lastName: 'Admin',
            email: 'admin@company.com',
            password: 'Admin@123',
            role: constants_1.ROLES.ADMIN,
            employeeId: 'EMP002',
            department: 'Operations',
        },
        {
            firstName: 'Sarah',
            lastName: 'Manager',
            email: 'manager@company.com',
            password: 'Admin@123',
            role: constants_1.ROLES.MANAGER,
            employeeId: 'EMP003',
            department: 'Operations',
        },
        {
            firstName: 'Mike',
            lastName: 'Engineer',
            email: 'engineer@company.com',
            password: 'Admin@123',
            role: constants_1.ROLES.ENGINEER,
            employeeId: 'EMP004',
            department: 'Engineering',
        },
        {
            firstName: 'Tom',
            lastName: 'Technician',
            email: 'technician@company.com',
            password: 'Admin@123',
            role: constants_1.ROLES.TECHNICIAN,
            employeeId: 'EMP005',
            department: 'Maintenance',
        },
        {
            firstName: 'David',
            lastName: 'Driver',
            email: 'driver@company.com',
            password: 'Admin@123',
            role: constants_1.ROLES.DRIVER,
            employeeId: 'EMP006',
            department: 'Transport',
        },
        {
            firstName: 'Lisa',
            lastName: 'Viewer',
            email: 'viewer@company.com',
            password: 'Admin@123',
            role: constants_1.ROLES.VIEWER,
            employeeId: 'EMP007',
            department: 'HR',
        },
    ]);
    const [superAdmin, , manager, engineer] = users;
    // Projects
    const projects = await Project_1.Project.create([
        {
            name: 'Downtown Tower Construction',
            code: 'PRJ001',
            client: 'Metro Developers',
            contractNumber: 'CNT-2026-001',
            contractValue: 2500000,
            budget: 2500000,
            location: 'Downtown',
            startDate: new Date('2026-01-15'),
            endDate: new Date('2027-06-30'),
            status: 'Active',
            progressPercent: 35,
            plannedProgressPercent: 40,
            actualProgressPercent: 35,
            delayStatus: 'At Risk',
            projectManager: manager._id,
            createdBy: superAdmin._id,
            isActive: true,
        },
        {
            name: 'Highway Bridge Project',
            code: 'PRJ002',
            client: 'State Transport Authority',
            contractNumber: 'CNT-2026-002',
            contractValue: 1800000,
            budget: 1800000,
            location: 'North District',
            startDate: new Date('2026-03-01'),
            endDate: new Date('2027-12-31'),
            status: 'Planning Stage',
            progressPercent: 15,
            projectManager: manager._id,
            createdBy: superAdmin._id,
            isActive: true,
        },
        {
            name: 'Industrial Park Development',
            code: 'PRJ003',
            client: 'Industrial Corp',
            contractNumber: 'CNT-2026-003',
            contractValue: 3200000,
            budget: 3200000,
            location: 'East Zone',
            startDate: new Date('2025-06-01'),
            endDate: new Date('2026-05-31'),
            status: 'Completed',
            progressPercent: 100,
            actualProgressPercent: 100,
            projectManager: manager._id,
            createdBy: superAdmin._id,
            isActive: true,
        },
    ]);
    // Equipment
    const equipment = await Equipment_1.Equipment.create([
        { name: 'Tower Crane TC-500', equipmentId: 'EQ001', category: 'Crane', manufacturer: 'Liebherr' },
        { name: 'Excavator EX-200', equipmentId: 'EQ002', category: 'Excavator', manufacturer: 'Caterpillar' },
        { name: 'Concrete Mixer CM-100', equipmentId: 'EQ003', category: 'Mixer', manufacturer: 'Schwing' },
    ]);
    const now = new Date();
    const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    // Certificates
    await Certificate_1.Certificate.create([
        {
            certificateId: 'CERT-2026-10001',
            certificateNumber: 'ISO-9001-2024',
            certificateName: 'ISO 9001 Quality Management',
            category: 'Project',
            relatedProject: projects[0]._id,
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
            relatedEquipment: equipment[0]._id,
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
    ]);
    // Vehicles
    await Vehicle_1.Vehicle.create([
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
            currentStatus: 'Available',
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
            currentStatus: 'Available',
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
    ]);
    console.log('\n✅ Seed data created successfully!\n');
    console.log('Login credentials (password: Admin@123):');
    console.log('  superadmin@company.com - Super Admin');
    console.log('  admin@company.com      - Admin');
    console.log('  manager@company.com    - Manager');
    console.log('  engineer@company.com   - Engineer');
    console.log('  technician@company.com - Technician');
    console.log('  driver@company.com     - Driver');
    console.log('  viewer@company.com     - Viewer\n');
    await mongoose_1.default.disconnect();
}
seed().catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map