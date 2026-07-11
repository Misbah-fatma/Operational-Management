export class ApiError extends Error {
  statusCode: number;
  errors?: string[];

  constructor(statusCode: number, message: string, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: Record<string, unknown>;

  constructor(success: boolean, message: string, data?: T, meta?: Record<string, unknown>) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static success<T>(message: string, data?: T, meta?: Record<string, unknown>) {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message: string, errors?: string[]) {
    throw new ApiError(400, message, errors);
  }
}
