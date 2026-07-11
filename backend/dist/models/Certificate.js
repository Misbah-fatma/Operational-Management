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
exports.Certificate = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../constants");
const certificateFileSchema = new mongoose_1.Schema({
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    url: String,
}, { _id: false });
const certificateSchema = new mongoose_1.Schema({
    certificateId: { type: String, required: true, unique: true, trim: true },
    certificateNumber: { type: String, required: true, trim: true },
    certificateName: { type: String, required: true, trim: true },
    category: { type: String, enum: constants_1.CERTIFICATE_CATEGORIES, required: true },
    relatedEmployee: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    relatedEquipment: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Equipment' },
    relatedVehicle: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vehicle' },
    relatedProject: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    renewalDate: { type: Date },
    issuingAuthority: { type: String, required: true, trim: true },
    status: { type: String, enum: constants_1.CERTIFICATE_STATUSES, default: 'Active' },
    certificateFile: certificateFileSchema,
    remarks: { type: String, trim: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ category: 1, status: 1 });
certificateSchema.index({ expiryDate: 1 });
certificateSchema.index({ isDeleted: 1 });
certificateSchema.index({ certificateName: 'text', certificateNumber: 'text' });
exports.Certificate = mongoose_1.default.model('Certificate', certificateSchema);
//# sourceMappingURL=Certificate.js.map