/**
 * Standardized Response Utilities for Edge Functions
 */

import { corsHeaders } from './cors';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Create success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  meta?: Record<string, any>
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create error response
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: any
): Response {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Handle errors and return appropriate response
 */
export function handleError(error: any): Response {
  console.error('Edge function error:', error);

  if (error.message === 'Unauthorized') {
    return errorResponse('UNAUTHORIZED', 'Authentication required', 401);
  }

  if (error.message.startsWith('Forbidden')) {
    return errorResponse('FORBIDDEN', error.message, 403);
  }

  if (error.message === 'Not Found') {
    return errorResponse('NOT_FOUND', 'Resource not found', 404);
  }

  if (error.message.includes('Rate limit')) {
    return errorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests', 429);
  }

  // Generic server error
  return errorResponse(
    'INTERNAL_ERROR',
    'An internal server error occurred',
    500,
    process.env.NODE_ENV === 'development' ? error.message : undefined
  );
}
