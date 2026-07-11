"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
exports.ApiError = ApiError;
class ApiResponse {
    constructor(success, message, data, meta) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.meta = meta;
    }
    static success(message, data, meta) {
        return new ApiResponse(true, message, data, meta);
    }
    static error(message, errors) {
        throw new ApiError(400, message, errors);
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map