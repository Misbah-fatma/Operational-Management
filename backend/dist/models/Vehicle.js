"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../constants");
const vehicleSchema = new mongoose_1.Schema({
    vehicleId: { type: String, required: true, unique: true, trim: true },
    vehicleName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    vin: { type: String, trim: true },
    insuranceNumber: { type: String, trim: true },
    insuranceExpiryDate: { type: Date },
    mvpiExpiryDate: { type: Date },
    currentKm: { type: Number, default: 0 },
    fuelType: { type: String, enum: constants_1.FUEL_TYPES, required: true },
    currentStatus: { type: String, enum: constants_1.VEHICLE_STATUSES, default: 'Available' },
    assignedProject: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    assignedEmployee: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String, trim: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
vehicleSchema.index({ vehicleId: 1 });
vehicleSchema.index({ currentStatus: 1 });
vehicleSchema.index({ isDeleted: 1 });
vehicleSchema.index({ vehicleName: 'text', registrationNumber: 'text' });
exports.Vehicle = mongoose_1.default.model('Vehicle', vehicleSchema);
//# sourceMappingURL=Vehicle.js.map