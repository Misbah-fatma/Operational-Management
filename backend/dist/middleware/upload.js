"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterError = exports.uploadProgressAttachments = exports.uploadProjectDocument = exports.uploadReturnPhotos = exports.uploadVehiclePhotos = exports.uploadCertificate = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const env_1 = require("../config/env");
const storage_1 = require("../utils/storage");
const ApiResponse_1 = require("../utils/ApiResponse");
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];
const createStorage = (subDir) => {
    const uploadPath = storage_1.storageService.getSubDir(subDir);
    return multer_1.default.diskStorage({
        destination: (_req, _file, cb) => cb(null, uploadPath),
        filename: (_req, file, cb) => {
            const ext = path_1.default.extname(file.originalname);
            cb(null, `${(0, uuid_1.v4)()}${ext}`);
        },
    });
};
const fileFilter = (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new ApiResponse_1.ApiError(400, 'Only PDF and image files are allowed'), false);
    }
};
exports.uploadCertificate = (0, multer_1.default)({
    storage: createStorage('certificates'),
    limits: { fileSize: env_1.env.maxFileSize },
    fileFilter,
}).single('certificateFile');
exports.uploadVehiclePhotos = (0, multer_1.default)({
    storage: createStorage('assignments'),
    limits: { fileSize: env_1.env.maxFileSize, files: 20 },
    fileFilter,
}).fields([
    { name: 'frontPhoto', maxCount: 1 },
    { name: 'rearPhoto', maxCount: 1 },
    { name: 'leftSidePhoto', maxCount: 1 },
    { name: 'rightSidePhoto', maxCount: 1 },
    { name: 'interiorPhoto', maxCount: 1 },
    { name: 'existingDamagePhotos', maxCount: 10 },
]);
exports.uploadReturnPhotos = (0, multer_1.default)({
    storage: createStorage('assignments'),
    limits: { fileSize: env_1.env.maxFileSize, files: 20 },
    fileFilter,
}).fields([
    { name: 'returnPhotos', maxCount: 10 },
    { name: 'damagePhotos', maxCount: 10 },
]);
exports.uploadProjectDocument = (0, multer_1.default)({
    storage: createStorage('projects'),
    limits: { fileSize: env_1.env.maxFileSize },
    fileFilter,
}).single('documentFile');
exports.uploadProgressAttachments = (0, multer_1.default)({
    storage: createStorage('projects'),
    limits: { fileSize: env_1.env.maxFileSize, files: 10 },
    fileFilter,
}).array('attachments', 10);
const handleMulterError = (err, _req, _res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            next(new ApiResponse_1.ApiError(400, 'File size exceeds limit'));
            return;
        }
        next(new ApiResponse_1.ApiError(400, err.message));
        return;
    }
    next(err);
};
exports.handleMulterError = handleMulterError;
//# sourceMappingURL=upload.js.map