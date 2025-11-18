/**
 * Rate Limiting for Edge Functions
 * Token bucket algorithm implementation
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Check rate limit for a given identifier
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!record || record.resetAt < now) {
    // Create new record
    const resetAt = now + config.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  if (record.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Get rate limit identifier from request
 */
export function getRateLimitIdentifier(req: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Use IP address as fallback
  const ip = req.headers.get('x-forwarded-for') || 
              req.headers.get('x-real-ip') || 
              'unknown';
  
  return `ip:${ip}`;
}

/**
 * Apply rate limit headers to response
 */
export function addRateLimitHeaders(
  response: Response,
  limit: { remaining: number; resetAt: number; maxRequests: number }
): Response {
  const headers = new Headers(response.headers);
  headers.set('X-RateLimit-Limit', limit.maxRequests.toString());
  headers.set('X-RateLimit-Remaining', limit.remaining.toString());
  headers.set('X-RateLimit-Reset', limit.resetAt.toString());

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
