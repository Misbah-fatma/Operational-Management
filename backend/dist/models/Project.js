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
exports.Project = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../constants");
const projectSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    client: { type: String, trim: true },
    contractNumber: { type: String, trim: true },
    contractValue: { type: Number, default: 0 },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    sla: { type: String, trim: true },
    status: {
        type: String,
        enum: constants_1.PROJECT_STATUSES,
        default: 'Proposal Stage',
    },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    plannedProgressPercent: { type: Number, default: 0, min: 0, max: 100 },
    actualProgressPercent: { type: Number, default: 0, min: 0, max: 100 },
    delayStatus: {
        type: String,
        enum: constants_1.PROJECT_DELAY_STATUSES,
        default: 'On Track',
    },
    projectManager: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
projectSchema.index({ status: 1, isDeleted: 1 });
projectSchema.index({ client: 1 });
projectSchema.index({ name: 'text', code: 'text', client: 'text' });
exports.Project = mongoose_1.default.model('Project', projectSchema);
//# sourceMappingURL=Project.js.map