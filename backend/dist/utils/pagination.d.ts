import { Request } from 'express';
export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}
export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export declare const getPagination: (req: Request) => PaginationOptions;
export declare const buildSort: (sortBy: string, sortOrder: "asc" | "desc") => Record<string, 1 | -1>;
export declare const buildPaginationMeta: (page: number, limit: number, total: number) => {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};
export declare const escapeRegex: (str: string) => string;
//# sourceMappingURL=pagination.d.ts.map