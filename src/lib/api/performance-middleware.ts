/**
 * Performance Middleware
 * Automatically applies performance optimizations to all API routes
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { measureAsync } from '@/lib/performance/monitoring';
import { withCache, CACHE_TTL, CACHE_PREFIX } from '@/lib/performance/cache';
import { addCacheHeaders } from '@/lib/performance/compression';

/**
 * Cache configuration for different route patterns
 */
const ROUTE_CACHE_CONFIG: Record<string, { ttl: number; cacheControl: { maxAge: number; sMaxAge: number; staleWhileRevalidate: number } }> = {
  // Analytics and KPI routes - 5 minute cache
  '/api/atlvs/kpi': {
    ttl: CACHE_TTL.MEDIUM,
    cacheControl: { maxAge: 60, sMaxAge: 300, staleWhileRevalidate: 600 },
  },
  '/api/atlvs/analytics': {
    ttl: CACHE_TTL.MEDIUM,
    cacheControl: { maxAge: 60, sMaxAge: 300, staleWhileRevalidate: 600 },
  },
  '/api/compvss/analytics': {
    ttl: CACHE_TTL.MEDIUM,
    cacheControl: { maxAge: 60, sMaxAge: 300, staleWhileRevalidate: 600 },
  },
  '/api/gvteway/analytics': {
    ttl: CACHE_TTL.MEDIUM,
    cacheControl: { maxAge: 60, sMaxAge: 300, staleWhileRevalidate: 600 },
  },
  
  // List endpoints - 1 minute cache
  '/api/events': {
    ttl: CACHE_TTL.SHORT,
    cacheControl: { maxAge: 30, sMaxAge: 60, staleWhileRevalidate: 120 },
  },
  '/api/tickets': {
    ttl: CACHE_TTL.SHORT,
    cacheControl: { maxAge: 30, sMaxAge: 60, staleWhileRevalidate: 120 },
  },
  '/api/products': {
    ttl: CACHE_TTL.SHORT,
    cacheControl: { maxAge: 30, sMaxAge: 60, staleWhileRevalidate: 120 },
  },
  
  // Static/reference data - 1 hour cache
  '/api/venues': {
    ttl: CACHE_TTL.LONG,
    cacheControl: { maxAge: 600, sMaxAge: 3600, staleWhileRevalidate: 7200 },
  },
  '/api/categories': {
    ttl: CACHE_TTL.LONG,
    cacheControl: { maxAge: 600, sMaxAge: 3600, staleWhileRevalidate: 7200 },
  },
};

/**
 * Routes that should not be cached (mutations)
 */
const NO_CACHE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
const NO_CACHE_PATTERNS = [
  '/api/auth',
  '/api/checkout',
  '/api/payment',
  '/api/upload',
  '/api/webhook',
];

/**
 * Get cache configuration for a route
 */
function getCacheConfig(pathname: string) {
  for (const [pattern, config] of Object.entries(ROUTE_CACHE_CONFIG)) {
    if (pathname.startsWith(pattern)) {
      return config;
    }
  }
  return null;
}

/**
 * Check if route should be cached
 */
function shouldCache(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Don't cache mutations
  if (NO_CACHE_METHODS.includes(method)) {
    return false;
  }

  // Don't cache specific patterns
  if (NO_CACHE_PATTERNS.some(pattern => pathname.startsWith(pattern))) {
    return false;
  }

  return true;
}

/**
 * Generate cache key for request
 */
function generateCacheKey(request: NextRequest): string {
  const { pathname, search } = request.nextUrl;
  const userId = request.headers.get('x-user-id') || 'anonymous';
  return `${CACHE_PREFIX.QUERY}${pathname}${search}:${userId}`;
}

/**
 * Apply performance optimizations to API response
 */
export async function withPerformanceOptimizations(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const startTime = Date.now();

  try {
    // Check if route should be cached
    if (!shouldCache(request)) {
      return await measureAsync(
        `api:${pathname}`,
        'api',
        handler
      );
    }

    // Get cache configuration
    const cacheConfig = getCacheConfig(pathname);
    
    if (!cacheConfig) {
      // No specific cache config, just measure performance
      return await measureAsync(
        `api:${pathname}`,
        'api',
        handler
      );
    }

    // Use caching with performance monitoring
    const cacheKey = generateCacheKey(request);
    
    const response = await measureAsync(
      `api:${pathname}`,
      'api',
      async () => {
        // Try to get from cache
        const cached = await withCache(
          cacheKey,
          handler,
          cacheConfig.ttl
        );
        return cached;
      }
    );

    // Add cache headers
    return addCacheHeaders(response, cacheConfig.cacheControl);
  } catch (error) {
    console.error(`Performance middleware error for ${pathname}:`, error);
    // Return original handler result on error
    return handler();
  } finally {
    const duration = Date.now() - startTime;
    if (duration > 1000) {
      console.warn(`Slow API route: ${pathname} took ${duration}ms`);
    }
  }
}

/**
 * Wrapper for API route handlers
 */
export function withPerformance(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    return withPerformanceOptimizations(
      request,
      () => handler(request, context)
    );
  };
}
