import { NextResponse } from 'next/server';

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function successResponse<T>(data: T, meta?: ApiResponse['meta']) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status: 200 }
  );
}

export function createdResponse<T>(data: T) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status: 201 }
  );
}

export function noContentResponse() {
  return new NextResponse(null, { status: 204 });
}

export function errorResponse(
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    { status: statusCode }
  );
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return errorResponse(error.statusCode, error.code, error.message, error.details);
  }

  if (error instanceof Error) {
    return errorResponse(500, 'INTERNAL_ERROR', error.message);
  }

  return errorResponse(500, 'UNKNOWN_ERROR', 'An unexpected error occurred');
}

// Common error responses
export const errors = {
  unauthorized: (message?: string) => 
    new ApiError(401, 'UNAUTHORIZED', message || 'Authentication required'),
  forbidden: (message?: string) => 
    new ApiError(403, 'FORBIDDEN', message || 'Access denied'),
  notFound: (resource: string) =>
    new ApiError(404, 'NOT_FOUND', `${resource} not found`),
  badRequest: (message: string, details?: Record<string, unknown>) =>
    new ApiError(400, 'BAD_REQUEST', message, details),
  conflict: (message: string) => new ApiError(409, 'CONFLICT', message),
  validationError: (details: Record<string, unknown>) =>
    new ApiError(400, 'VALIDATION_ERROR', 'Validation failed', details),
  rateLimitExceeded: () =>
    new ApiError(429, 'RATE_LIMIT_EXCEEDED', 'Too many requests'),
  serverError: (message: string) =>
    new ApiError(500, 'SERVER_ERROR', message),
};
