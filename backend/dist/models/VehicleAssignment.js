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
exports.VehicleAssignment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../constants");
const photoSchema = new mongoose_1.Schema({
    filename: String,
    originalName: String,
    path: String,
    url: String,
    type: String,
}, { _id: false });
const vehicleAssignmentSchema = new mongoose_1.Schema({
    assignmentId: { type: String, required: true, unique: true, trim: true },
    vehicle: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    assignedTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    assignmentDate: { type: Date, required: true, default: Date.now },
    expectedReturnDate: { type: Date },
    assignedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    startingKm: { type: Number, required: true },
    fuelLevel: { type: String, enum: constants_1.FUEL_LEVELS, required: true },
    notes: { type: String, trim: true },
    preAssignmentPhotos: [photoSchema],
    status: { type: String, enum: ['Active', 'Returned', 'Overdue'], default: 'Active' },
    returnDetails: {
        returnDate: Date,
        finalKm: Number,
        fuelLevel: { type: String, enum: constants_1.FUEL_LEVELS },
        vehicleCondition: { type: String, enum: constants_1.VEHICLE_CONDITIONS },
        returnPhotos: [photoSchema],
        damagePhotos: [photoSchema],
        remarks: String,
        returnedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
vehicleAssignmentSchema.index({ assignmentId: 1 });
vehicleAssignmentSchema.index({ vehicle: 1, status: 1 });
vehicleAssignmentSchema.index({ assignedTo: 1, status: 1 });
vehicleAssignmentSchema.index({ status: 1 });
exports.VehicleAssignment = mongoose_1.default.model('VehicleAssignment', vehicleAssignmentSchema);
//# sourceMappingURL=VehicleAssignment.js.map