/**
 * API Route Validation Middleware
 * Provides centralized validation for all API routes using Zod
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: ValidationError[];
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Create standardized API response
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: ApiResponse['error']
): ApiResponse<T> {
  return {
    success,
    ...(data && { data }),
    ...(error && { error }),
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Create success response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(createApiResponse(true, data), { status });
}

/**
 * Create error response
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 400,
  details?: ValidationError[]
): NextResponse {
  return NextResponse.json(
    createApiResponse(false, undefined, { code, message, details }),
    { status }
  );
}

/**
 * Format Zod validation errors
 */
export function formatZodErrors(error: ZodError): ValidationError[] {
  return error.issues.map((err: z.ZodIssue) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}

/**
 * Validate request body against Zod schema
 */
export async function validateBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await req.json();
    const validated = schema.parse(body);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        response: errorResponse(
          'VALIDATION_ERROR',
          'Request validation failed',
          400,
          formatZodErrors(error)
        ),
      };
    }
    return {
      success: false,
      response: errorResponse('INVALID_JSON', 'Invalid JSON in request body', 400),
    };
  }
}

/**
 * Validate query parameters against Zod schema
 */
export function validateQuery<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const validated = schema.parse(params);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        response: errorResponse(
          'VALIDATION_ERROR',
          'Query parameter validation failed',
          400,
          formatZodErrors(error)
        ),
      };
    }
    return {
      success: false,
      response: errorResponse('INVALID_PARAMS', 'Invalid query parameters', 400),
    };
  }
}

/**
 * Validate route parameters
 */
export function validateParams<T>(
  params: Record<string, string | string[]>,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
  try {
    const validated = schema.parse(params);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        response: errorResponse(
          'VALIDATION_ERROR',
          'Route parameter validation failed',
          400,
          formatZodErrors(error)
        ),
      };
    }
    return {
      success: false,
      response: errorResponse('INVALID_PARAMS', 'Invalid route parameters', 400),
    };
  }
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  id: z.object({
    id: z.string().uuid('Invalid ID format'),
  }),

  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),

  search: z.object({
    q: z.string().min(1).max(200).optional(),
    sort: z.enum(['asc', 'desc']).optional(),
    sortBy: z.string().optional(),
  }),

  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
};

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 10000); // Limit length
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value) as T[Extract<keyof T, string>];
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>) as T[Extract<keyof T, string>];
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeString(item)
          : typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : item
      ) as T[Extract<keyof T, string>];
    }
  }
  
  return sanitized;
}

/**
 * Validate and sanitize request
 */
export async function validateAndSanitize<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  const validation = await validateBody(req, schema);
  
  if (!validation.success) {
    return validation;
  }
  
  // Sanitize the validated data
  const sanitized = sanitizeObject(validation.data as Record<string, unknown>) as T;
  
  return { success: true, data: sanitized };
}
