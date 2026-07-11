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
exports.VehicleMaintenance = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../constants");
const vehicleMaintenanceSchema = new mongoose_1.Schema({
    vehicle: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    maintenanceType: { type: String, enum: constants_1.MAINTENANCE_TYPES, required: true },
    description: { type: String, required: true, trim: true },
    scheduledDate: { type: Date },
    completedDate: { type: Date },
    cost: { type: Number, default: 0 },
    vendor: { type: String, trim: true },
    odometerReading: { type: Number },
    nextDueDate: { type: Date },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
vehicleMaintenanceSchema.index({ vehicle: 1 });
vehicleMaintenanceSchema.index({ maintenanceType: 1 });
vehicleMaintenanceSchema.index({ nextDueDate: 1 });
exports.VehicleMaintenance = mongoose_1.default.model('VehicleMaintenance', vehicleMaintenanceSchema);
//# sourceMappingURL=VehicleMaintenance.js.map