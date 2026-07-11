import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

export interface StoredFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export class LocalStorageService {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = path.resolve(process.cwd(), baseDir || env.uploadDir);
    this.ensureDir(this.baseDir);
  }

  private ensureDir(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  getSubDir(subDir: string): string {
    const fullPath = path.join(this.baseDir, subDir);
    this.ensureDir(fullPath);
    return fullPath;
  }

  storeFile(file: Express.Multer.File, subDir: string): StoredFile {
    const relativePath = path.join(subDir, file.filename);
    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: relativePath,
      url: `/uploads/${relativePath.replace(/\\/g, '/')}`,
    };
  }

  getAbsolutePath(relativePath: string): string {
    return path.join(this.baseDir, relativePath);
  }

  deleteFile(relativePath: string): boolean {
    const absolutePath = this.getAbsolutePath(relativePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      return true;
    }
    return false;
  }

  fileExists(relativePath: string): boolean {
    return fs.existsSync(this.getAbsolutePath(relativePath));
  }
}

export const storageService = new LocalStorageService();

// Abstraction for future S3 migration
export interface IStorageService {
  storeFile(file: Express.Multer.File, subDir: string): StoredFile;
  getAbsolutePath(relativePath: string): string;
  deleteFile(relativePath: string): boolean;
  fileExists(relativePath: string): boolean;
}
