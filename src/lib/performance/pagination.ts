/**
 * Pagination Utilities
 * Standardized pagination for all list endpoints
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor?: string;
    prevCursor?: string;
  };
}

/**
 * Default pagination limits
 */
export const PAGINATION_DEFAULTS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const;

/**
 * Parse and validate pagination parameters
 */
export function parsePaginationParams(
  searchParams: URLSearchParams
): Required<Omit<PaginationParams, 'cursor'>> & Pick<PaginationParams, 'cursor'> {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    PAGINATION_DEFAULTS.MAX_LIMIT,
    Math.max(
      PAGINATION_DEFAULTS.MIN_LIMIT,
      parseInt(searchParams.get('limit') || String(PAGINATION_DEFAULTS.DEFAULT_LIMIT), 10)
    )
  );
  const cursor = searchParams.get('cursor') || undefined;

  return { page, limit, cursor };
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(
  page: number,
  limit: number,
  total: number
): PaginationResult<never>['pagination'] {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginationResult<T> {
  return {
    data,
    pagination: calculatePagination(page, limit, total),
  };
}

/**
 * Calculate skip value for Prisma queries
 */
export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}
