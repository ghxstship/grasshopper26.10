/**
 * API Validation Utilities
 * Request validation helpers using Zod
 */

import { z, ZodSchema } from 'zod';

export class ValidationError extends Error {
  constructor(
    message: string,
    public details: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
  data: unknown,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.issues);
    }
    throw error;
  }
}

/**
 * Validate query parameters
 */
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries());
  
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid query parameters', error.issues);
    }
    throw error;
  }
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),

  // ID parameter
  id: z.string().uuid(),

  // Date range
  dateRange: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),

  // Search
  search: z.object({
    q: z.string().min(1).max(200),
  }),

  // Sort
  sort: z.object({
    sortBy: z.string(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),
};

/**
 * Extract and validate pagination params
 */
export function getPaginationParams(searchParams: URLSearchParams) {
  return validateQuery(searchParams, commonSchemas.pagination);
}

/**
 * Extract and validate sort params
 */
export function getSortParams(searchParams: URLSearchParams) {
  return validateQuery(searchParams, commonSchemas.sort);
}
