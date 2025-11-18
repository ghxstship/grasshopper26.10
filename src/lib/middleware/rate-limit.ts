/**
 * Rate Limiting Middleware
 * Implements IP-based and user-based rate limiting for API routes
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (for production, use Redis)
const store: RateLimitStore = {};

/**
 * Clean up expired entries from store
 */
function cleanupStore() {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupStore, 5 * 60 * 1000);

/**
 * Get client identifier (IP address or user ID)
 */
function getClientId(request: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }
  
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return `ip:${ip}`;
}

/**
 * Check if request should be rate limited
 */
function shouldRateLimit(
  clientId: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = store[clientId];

  // No entry or expired entry
  if (!entry || entry.resetTime < now) {
    store[clientId] = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    return {
      limited: true,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    limited: false,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit middleware factory
 */
export function rateLimit(config: RateLimitConfig) {
  return async (
    request: NextRequest,
    handler: () => Promise<NextResponse>,
    userId?: string
  ): Promise<NextResponse> => {
    const clientId = getClientId(request, userId);
    const result = shouldRateLimit(clientId, config);

    // Add rate limit headers
    const headers = new Headers();
    headers.set('X-RateLimit-Limit', String(config.maxRequests));
    headers.set('X-RateLimit-Remaining', String(result.remaining));
    headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)));

    if (result.limited) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      headers.set('Retry-After', String(retryAfter));

      return NextResponse.json(
        {
          error: config.message || 'Too many requests, please try again later',
          retryAfter,
        },
        {
          status: 429,
          headers,
        }
      );
    }

    // Execute handler
    const response = await handler();

    // Add rate limit headers to response
    for (const [key, value] of headers.entries()) {
      response.headers.set(key, value);
    }

    return response;
  };
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  // Strict: 10 requests per minute
  strict: {
    windowMs: 60 * 1000,
    maxRequests: 10,
    message: 'Too many requests. Please wait before trying again.',
  },
  
  // Standard: 100 requests per minute
  standard: {
    windowMs: 60 * 1000,
    maxRequests: 100,
  },
  
  // Relaxed: 1000 requests per minute
  relaxed: {
    windowMs: 60 * 1000,
    maxRequests: 1000,
  },
  
  // Auth: 5 attempts per 15 minutes
  auth: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: 'Too many authentication attempts. Please try again later.',
  },
  
  // API: 1000 requests per hour
  api: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 1000,
  },
  
  // Public: 30 requests per minute
  public: {
    windowMs: 60 * 1000,
    maxRequests: 30,
    message: 'Rate limit exceeded. Please try again in a moment.',
  },
};

/**
 * Helper to apply rate limiting to a route handler
 */
export async function withRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  config: RateLimitConfig = rateLimitConfigs.standard,
  userId?: string
): Promise<NextResponse> {
  const limiter = rateLimit(config);
  return limiter(request, handler, userId);
}
