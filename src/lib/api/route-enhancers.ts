/**
 * Route Enhancers
 * Utilities to quickly add rate limiting, validation, and error handling to API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/monitoring/logger';
import { errorTracker } from '@/lib/monitoring/error-tracking';

/**
 * Rate limit configuration presets
 */
export const RateLimitPresets = {
  // Auth endpoints - strict
  AUTH: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 per 15min
  
  // Public read endpoints - moderate
  PUBLIC_READ: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 per minute
  
  // Authenticated read - generous
  AUTH_READ: { windowMs: 60 * 1000, maxRequests: 120 }, // 120 per minute
  
  // Write operations - moderate
  WRITE: { windowMs: 60 * 1000, maxRequests: 30 }, // 30 per minute
  
  // Heavy operations - strict
  HEAVY: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 per minute
  
  // Default
  DEFAULT: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 per minute
};

/**
 * Simple in-memory rate limiter (use Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(
  key: string,
  config: { windowMs: number; maxRequests: number }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + config.windowMs };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: entry.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: entry.resetAt,
  };
}

/**
 * Route handler type
 */
export type RouteHandler = (
  request: NextRequest,
  context?: { params: Record<string, string> }
) => Promise<NextResponse> | NextResponse;

/**
 * Enhanced route handler options
 */
export interface RouteOptions {
  rateLimit?: keyof typeof RateLimitPresets | { windowMs: number; maxRequests: number };
  validate?: {
    body?: z.ZodSchema;
    query?: z.ZodSchema;
    params?: z.ZodSchema;
  };
  auth?: boolean;
  transaction?: boolean;
}

/**
 * Enhance route with rate limiting, validation, and error handling
 */
export function enhanceRoute(
  handler: RouteHandler,
  options: RouteOptions = {}
): RouteHandler {
  return async (request: NextRequest, context?: { params: Record<string, string> }) => {
    const startTime = performance.now();
    const method = request.method;
    const url = request.url;

    try {
      // Rate limiting
      if (options.rateLimit) {
        const config = typeof options.rateLimit === 'string'
          ? RateLimitPresets[options.rateLimit]
          : options.rateLimit;

        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimitKey = `${ip}:${request.nextUrl.pathname}`;
        const { allowed, resetAt } = checkRateLimit(rateLimitKey, config);

        if (!allowed) {
          const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
          
          logger.warn('Rate limit exceeded', {
            ip,
            path: request.nextUrl.pathname,
            retryAfter,
          });

          return NextResponse.json(
            {
              error: 'Too many requests',
              retryAfter,
            },
            {
              status: 429,
              headers: {
                'X-RateLimit-Limit': config.maxRequests.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': resetAt.toString(),
                'Retry-After': retryAfter.toString(),
              },
            }
          );
        }
      }

      // Authentication check
      if (options.auth) {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }
      }

      // Validation
      if (options.validate) {
        // Validate body
        if (options.validate.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
          try {
            const body = await request.json();
            options.validate.body.parse(body);
          } catch (error) {
            if (error instanceof z.ZodError) {
              return NextResponse.json(
                {
                  error: 'Validation failed',
                  details: (error as any).errors,
                },
                { status: 400 }
              );
            }
            throw error;
          }
        }

        // Validate query params
        if (options.validate.query) {
          try {
            const searchParams = Object.fromEntries(request.nextUrl.searchParams);
            options.validate.query.parse(searchParams);
          } catch (error) {
            if (error instanceof z.ZodError) {
              return NextResponse.json(
                {
                  error: 'Invalid query parameters',
                  details: (error as any).errors,
                },
                { status: 400 }
              );
            }
            throw error;
          }
        }

        // Validate path params
        if (options.validate.params && context?.params) {
          try {
            options.validate.params.parse(context.params);
          } catch (error) {
            if (error instanceof z.ZodError) {
              return NextResponse.json(
                {
                  error: 'Invalid path parameters',
                  details: (error as any).errors,
                },
                { status: 400 }
              );
            }
            throw error;
          }
        }
      }

      // Execute handler
      const response = await handler(request, context);

      // Log successful request
      const duration = performance.now() - startTime;
      logger.logRequest(method, url, response.status, duration);

      return response;

    } catch (error) {
      // Error handling
      const duration = performance.now() - startTime;
      
      logger.error('Route handler error', error, {
        method,
        url,
        duration,
      });

      errorTracker.trackAPIError(
        error as Error,
        request.nextUrl.pathname,
        method,
        500
      );

      return NextResponse.json(
        {
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Quick rate limit wrapper
 */
export function withRateLimit(
  handler: RouteHandler,
  preset: keyof typeof RateLimitPresets = 'DEFAULT'
): RouteHandler {
  return enhanceRoute(handler, { rateLimit: preset });
}

/**
 * Quick validation wrapper
 */
export function withValidation(
  handler: RouteHandler,
  schemas: {
    body?: z.ZodSchema;
    query?: z.ZodSchema;
    params?: z.ZodSchema;
  }
): RouteHandler {
  return enhanceRoute(handler, { validate: schemas });
}

/**
 * Quick auth wrapper
 */
export function withAuth(handler: RouteHandler): RouteHandler {
  return enhanceRoute(handler, { auth: true });
}

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),

  // ID parameter
  id: z.object({
    id: z.string().uuid(),
  }),

  // Search
  search: z.object({
    q: z.string().min(1).max(200),
  }),

  // Date range
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),

  // Sort
  sort: z.object({
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
  }),
};

/**
 * Combine multiple enhancers
 */
export function composeEnhancers(
  handler: RouteHandler,
  ...enhancers: Array<(h: RouteHandler) => RouteHandler>
): RouteHandler {
  return enhancers.reduce((h, enhancer) => enhancer(h), handler);
}

/**
 * Example usage:
 * 
 * // Simple rate limiting
 * export const GET = withRateLimit(async (request) => {
 *   // handler code
 * }, 'PUBLIC_READ');
 * 
 * // With validation
 * export const POST = withValidation(async (request) => {
 *   const body = await request.json();
 *   // handler code
 * }, {
 *   body: z.object({
 *     name: z.string(),
 *     email: z.string().email(),
 *   }),
 * });
 * 
 * // Full enhancement
 * export const PUT = enhanceRoute(async (request, { params }) => {
 *   // handler code
 * }, {
 *   rateLimit: 'WRITE',
 *   auth: true,
 *   validate: {
 *     params: CommonSchemas.id,
 *     body: z.object({ name: z.string() }),
 *   },
 * });
 * 
 * // Compose multiple
 * export const DELETE = composeEnhancers(
 *   async (request) => { },
 *   withAuth,
 *   (h) => withRateLimit(h, 'WRITE'),
 *   (h) => withValidation(h, { params: CommonSchemas.id })
 * );
 */
