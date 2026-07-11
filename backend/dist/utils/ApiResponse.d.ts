export declare class ApiError extends Error {
    statusCode: number;
    errors?: string[];
    constructor(statusCode: number, message: string, errors?: string[]);
}
export declare class ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    meta?: Record<string, unknown>;
    constructor(success: boolean, message: string, data?: T, meta?: Record<string, unknown>);
    static success<T>(message: string, data?: T, meta?: Record<string, unknown>): ApiResponse<T>;
    static error(message: string, errors?: string[]): void;
}
//# sourceMappingURL=ApiResponse.d.ts.map