/**
 * Database Query Optimization Utilities
 * Helpers for optimizing Prisma queries
 */

import { Prisma } from '@prisma/client';

/**
 * Common select fields to reduce payload size
 */
export const selectFields = {
  user: {
    id: true,
    email: true,
    name: true,
    role: true,
    avatar: true,
    createdAt: true,
  },
  event: {
    id: true,
    name: true,
    slug: true,
    startDate: true,
    endDate: true,
    status: true,
    venue: true,
    createdAt: true,
  },
  ticket: {
    id: true,
    name: true,
    price: true,
    quantity: true,
    sold: true,
    status: true,
  },
  order: {
    id: true,
    orderNumber: true,
    status: true,
    total: true,
    createdAt: true,
  },
} as const;

/**
 * Batch load related data to avoid N+1 queries
 */
export async function batchLoad<T, K extends keyof T>(
  items: T[],
  key: K,
  loader: (ids: T[K][]) => Promise<Map<T[K], any>>
): Promise<T[]> {
  const ids = items.map((item) => item[key]);
  const uniqueIds = [...new Set(ids)];
  const dataMap = await loader(uniqueIds as T[K][]);

  return items.map((item) => ({
    ...item,
    [key]: dataMap.get(item[key]),
  }));
}

/**
 * Create optimized where clause with proper indexing
 */
export function createOptimizedWhere<T>(
  filters: Partial<T>,
  _searchFields?: (keyof T)[]
): any {
  const where: any = {};

  // Add indexed filters first
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      where[key] = value;
    }
  });

  return where;
}

/**
 * Create full-text search query
 */
export function createSearchQuery(
  searchTerm: string | undefined,
  fields: string[]
): any {
  if (!searchTerm || searchTerm.trim() === '') {
    return {};
  }

  const term = searchTerm.trim();
  
  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: term,
        mode: 'insensitive' as Prisma.QueryMode,
      },
    })),
  };
}

/**
 * Optimize include for nested relations
 */
export function optimizeInclude<T extends Record<string, any>>(
  include: T,
  maxDepth: number = 2,
  currentDepth: number = 0
): T | undefined {
  if (currentDepth >= maxDepth) {
    return undefined;
  }

  const optimized: any = {};
  
  Object.entries(include).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      const nested = optimizeInclude(value, maxDepth, currentDepth + 1);
      if (nested) {
        optimized[key] = nested;
      }
    } else {
      optimized[key] = value;
    }
  });

  return optimized as T;
}

/**
 * Create cursor-based pagination query
 */
export function createCursorQuery(
  cursor: string | undefined,
  _orderBy: any
): { cursor?: any; skip?: number } {
  if (!cursor) {
    return {};
  }

  return {
    cursor: { id: cursor },
    skip: 1, // Skip the cursor itself
  };
}
