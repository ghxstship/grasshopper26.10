/**
 * Request Validation Middleware
 * Provides Zod-based validation for request bodies, query params, and files
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError, ZodSchema } from 'zod';

interface ValidationError {
  field: string;
  message: string;
}

/**
 * Format Zod errors into user-friendly format
 */
function formatZodErrors(error: ZodError): ValidationError[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

/**
 * Validate request body against schema
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json();
    const validated = schema.parse(body);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Validation failed',
            details: formatZodErrors(error),
          },
          { status: 400 }
        ),
      };
    }
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate query parameters against schema
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const validated = schema.parse(params);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: formatZodErrors(error),
          },
          { status: 400 }
        ),
      };
    }
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate route parameters
 */
export function validateParams<T>(
  params: Record<string, string>,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
  try {
    const validated = schema.parse(params);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Invalid route parameters',
            details: formatZodErrors(error),
          },
          { status: 400 }
        ),
      };
    }
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid route parameters' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Validate file upload
 */
export async function validateFile(
  request: NextRequest,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    required?: boolean;
  } = {}
): Promise<
  { success: true; file: File } | { success: false; response: NextResponse }
> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      if (options.required) {
        return {
          success: false,
          response: NextResponse.json(
            { error: 'File is required' },
            { status: 400 }
          ),
        };
      }
      return {
        success: false,
        response: NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        ),
      };
    }

    // Check file size
    if (options.maxSize && file.size > options.maxSize) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: `File size exceeds maximum of ${options.maxSize / 1024 / 1024}MB`,
          },
          { status: 400 }
        ),
      };
    }

    // Check file type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: `File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`,
          },
          { status: 400 }
        ),
      };
    }

    return { success: true, file };
  } catch {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Failed to process file upload' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  }),

  // ID parameter
  id: z.object({
    id: z.string().uuid('Invalid ID format'),
  }),

  // Date range
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),

  // Search
  search: z.object({
    q: z.string().min(1).optional(),
    query: z.string().min(1).optional(),
  }),

  // Email
  email: z.object({
    email: z.string().email('Invalid email address'),
  }),

  // Phone
  phone: z.object({
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  }),

  // Status filter
  status: z.object({
    status: z.string().optional(),
  }),

  // Sort
  sort: z.object({
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
};

/**
 * Combine multiple validation results
 */
export function combineValidations<T extends Record<string, unknown>>(
  ...validations: Array<
    { success: true; data: Partial<T> } | { success: false; response: NextResponse }
  >
): { success: true; data: T } | { success: false; response: NextResponse } {
  const combined: Partial<T> = {};

  for (const validation of validations) {
    if (!validation.success) {
      return validation as { success: false; response: NextResponse };
    }
    Object.assign(combined, validation.data);
  }

  return { success: true, data: combined as T };
}

/**
 * Helper to validate and execute handler
 */
export async function withValidation<TBody, TQuery, TParams>(
  request: NextRequest,
  handler: (validated: {
    body?: TBody;
    query?: TQuery;
    params?: TParams;
  }) => Promise<NextResponse>,
  schemas: {
    body?: ZodSchema<TBody>;
    query?: ZodSchema<TQuery>;
    params?: ZodSchema<TParams>;
  },
  routeParams?: Record<string, string>
): Promise<NextResponse> {
  const validated: {
    body?: TBody;
    query?: TQuery;
    params?: TParams;
  } = {};

  // Validate body
  if (schemas.body) {
    const bodyResult = await validateBody(request, schemas.body);
    if (!bodyResult.success) {
      return (bodyResult as { success: false; response: NextResponse }).response;
    }
    validated.body = bodyResult.data;
  }

  // Validate query
  if (schemas.query) {
    const queryResult = validateQuery(request, schemas.query);
    if (!queryResult.success) {
      return (queryResult as { success: false; response: NextResponse }).response;
    }
    validated.query = queryResult.data;
  }

  // Validate params
  if (schemas.params && routeParams) {
    const paramsResult = validateParams(routeParams, schemas.params);
    if (!paramsResult.success) {
      return (paramsResult as { success: false; response: NextResponse }).response;
    }
    validated.params = paramsResult.data;
  }

  return handler(validated);
}
