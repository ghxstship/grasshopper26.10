/**
 * API Rate Limiting Middleware
 * Implements token bucket algorithm for rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Get client identifier from request
 */
export function getClientIdentifier(req: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  // Include user agent for better uniqueness
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  return `${ip}:${userAgent}`;
}

/**
 * Clean up expired entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Rate limit middleware
 */
export function rateLimit(config: RateLimitConfig) {
  return async (
    req: NextRequest,
    handler: () => Promise<NextResponse>
  ): Promise<NextResponse> => {
    const clientId = getClientIdentifier(req);
    const now = Date.now();
    
    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      cleanupExpiredEntries();
    }
    
    let entry = rateLimitStore.get(clientId);
    
    // Initialize or reset if window expired
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
      };
      rateLimitStore.set(clientId, entry);
    }
    
    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
            retryAfter,
          },
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': entry.resetTime.toString(),
          },
        }
      );
    }
    
    // Increment counter
    entry.count++;
    
    // Execute handler
    const response = await handler();
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set(
      'X-RateLimit-Remaining',
      Math.max(0, config.maxRequests - entry.count).toString()
    );
    response.headers.set('X-RateLimit-Reset', entry.resetTime.toString());
    
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
  },
  
  // Standard: 100 requests per minute
  standard: {
    windowMs: 60 * 1000,
    maxRequests: 100,
  },
  
  // Lenient: 1000 requests per minute
  lenient: {
    windowMs: 60 * 1000,
    maxRequests: 1000,
  },
  
  // Auth: 5 requests per 15 minutes
  auth: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
  },
  
  // File upload: 10 requests per hour
  upload: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 10,
  },
  
  // Search: 30 requests per minute
  search: {
    windowMs: 60 * 1000,
    maxRequests: 30,
  },
};

/**
 * Apply rate limiting to a route handler
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (req: NextRequest, context?: { params: Record<string, string> }) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    context?: { params: Record<string, string> }
  ): Promise<NextResponse> => {
    return rateLimit(config)(req, () => handler(req, context));
  };
}

/**
 * Clear rate limit for a client (useful for testing)
 */
export function clearRateLimit(clientId: string): void {
  rateLimitStore.delete(clientId);
}

/**
 * Clear all rate limits (useful for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Get current rate limit status for a client
 */
export function getRateLimitStatus(clientId: string): {
  count: number;
  remaining: number;
  resetTime: number;
} | null {
  const entry = rateLimitStore.get(clientId);
  
  if (!entry) {
    return null;
  }
  
  return {
    count: entry.count,
    remaining: Math.max(0, 100 - entry.count), // Assuming standard limit
    resetTime: entry.resetTime,
  };
}
