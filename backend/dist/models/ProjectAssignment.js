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
exports.ProjectAssignment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const constants_1 = require("../constants");
const assignmentSchema = new mongoose_1.Schema({
    assignmentId: { type: String, required: true, unique: true, uppercase: true },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    resourceType: { type: String, enum: constants_1.PROJECT_RESOURCE_TYPES, required: true },
    employee: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    vehicle: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Vehicle' },
    equipment: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Equipment' },
    employeeRole: { type: String, enum: constants_1.PROJECT_EMPLOYEE_ROLES },
    workPackage: { type: String, trim: true },
    assignmentDate: { type: Date, required: true },
    releaseDate: { type: Date },
    status: {
        type: String,
        enum: constants_1.PROJECT_ASSIGNMENT_STATUSES,
        default: 'Active',
    },
    remarks: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
assignmentSchema.index({ resourceType: 1, status: 1, employee: 1 });
assignmentSchema.index({ resourceType: 1, status: 1, vehicle: 1 });
assignmentSchema.index({ resourceType: 1, status: 1, equipment: 1 });
exports.ProjectAssignment = mongoose_1.default.model('ProjectAssignment', assignmentSchema);
//# sourceMappingURL=ProjectAssignment.js.map