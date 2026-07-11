import multer from 'multer';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env';
import { storageService } from '../utils/storage';
import { ApiError } from '../utils/ApiResponse';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const createStorage = (subDir: string) => {
  const uploadPath = storageService.getSubDir(subDir);
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadPath),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  });
};

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only PDF and image files are allowed') as unknown as null, false);
  }
};

export const uploadCertificate = multer({
  storage: createStorage('certificates'),
  limits: { fileSize: env.maxFileSize },
  fileFilter,
}).single('certificateFile');

export const uploadVehiclePhotos = multer({
  storage: createStorage('assignments'),
  limits: { fileSize: env.maxFileSize, files: 20 },
  fileFilter,
}).fields([
  { name: 'frontPhoto', maxCount: 1 },
  { name: 'rearPhoto', maxCount: 1 },
  { name: 'leftSidePhoto', maxCount: 1 },
  { name: 'rightSidePhoto', maxCount: 1 },
  { name: 'interiorPhoto', maxCount: 1 },
  { name: 'existingDamagePhotos', maxCount: 10 },
]);

export const uploadReturnPhotos = multer({
  storage: createStorage('assignments'),
  limits: { fileSize: env.maxFileSize, files: 20 },
  fileFilter,
}).fields([
  { name: 'returnPhotos', maxCount: 10 },
  { name: 'damagePhotos', maxCount: 10 },
]);

export const uploadProjectDocument = multer({
  storage: createStorage('projects'),
  limits: { fileSize: env.maxFileSize },
  fileFilter,
}).single('documentFile');

export const uploadProgressAttachments = multer({
  storage: createStorage('projects'),
  limits: { fileSize: env.maxFileSize, files: 10 },
  fileFilter,
}).array('attachments', 10);

export const handleMulterError = (
  err: Error,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new ApiError(400, 'File size exceeds limit'));
      return;
    }
    next(new ApiError(400, err.message));
    return;
  }
  next(err);
};
