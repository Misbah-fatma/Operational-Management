export interface StoredFile {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    url: string;
}
export declare class LocalStorageService {
    private baseDir;
    constructor(baseDir?: string);
    private ensureDir;
    getSubDir(subDir: string): string;
    storeFile(file: Express.Multer.File, subDir: string): StoredFile;
    getAbsolutePath(relativePath: string): string;
    deleteFile(relativePath: string): boolean;
    fileExists(relativePath: string): boolean;
}
export declare const storageService: LocalStorageService;
export interface IStorageService {
    storeFile(file: Express.Multer.File, subDir: string): StoredFile;
    getAbsolutePath(relativePath: string): string;
    deleteFile(relativePath: string): boolean;
    fileExists(relativePath: string): boolean;
}
//# sourceMappingURL=storage.d.ts.map