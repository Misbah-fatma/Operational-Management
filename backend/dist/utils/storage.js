"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageService = exports.LocalStorageService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
class LocalStorageService {
    constructor(baseDir) {
        this.baseDir = path_1.default.resolve(process.cwd(), baseDir || env_1.env.uploadDir);
        this.ensureDir(this.baseDir);
    }
    ensureDir(dir) {
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
    }
    getSubDir(subDir) {
        const fullPath = path_1.default.join(this.baseDir, subDir);
        this.ensureDir(fullPath);
        return fullPath;
    }
    storeFile(file, subDir) {
        const relativePath = path_1.default.join(subDir, file.filename);
        return {
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: relativePath,
            url: `/uploads/${relativePath.replace(/\\/g, '/')}`,
        };
    }
    getAbsolutePath(relativePath) {
        return path_1.default.join(this.baseDir, relativePath);
    }
    deleteFile(relativePath) {
        const absolutePath = this.getAbsolutePath(relativePath);
        if (fs_1.default.existsSync(absolutePath)) {
            fs_1.default.unlinkSync(absolutePath);
            return true;
        }
        return false;
    }
    fileExists(relativePath) {
        return fs_1.default.existsSync(this.getAbsolutePath(relativePath));
    }
}
exports.LocalStorageService = LocalStorageService;
exports.storageService = new LocalStorageService();
//# sourceMappingURL=storage.js.map