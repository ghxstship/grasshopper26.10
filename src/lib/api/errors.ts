/**
 * API Error Utilities
 * Standardized error responses for API endpoints
 */

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errors = {
  rateLimitExceeded: () =>
    new ApiError(
      429,
      'RATE_LIMIT_EXCEEDED',
      'Too many requests. Please try again later.'
    ),

  unauthorized: () =>
    new ApiError(401, 'UNAUTHORIZED', 'Authentication required'),

  forbidden: () =>
    new ApiError(403, 'FORBIDDEN', 'Access denied'),

  notFound: (resource?: string) =>
    new ApiError(
      404,
      'NOT_FOUND',
      resource ? `${resource} not found` : 'Resource not found'
    ),

  badRequest: (message: string, details?: any) =>
    new ApiError(400, 'BAD_REQUEST', message, details),

  conflict: (message: string) =>
    new ApiError(409, 'CONFLICT', message),

  internalError: (message?: string) =>
    new ApiError(
      500,
      'INTERNAL_ERROR',
      message || 'An internal error occurred'
    ),

  validationError: (details: any) =>
    new ApiError(400, 'VALIDATION_ERROR', 'Validation failed', details),
};
