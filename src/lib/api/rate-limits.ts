/**
 * Rate Limiting Configuration
 * Centralized rate limit definitions for all API endpoints
 */

export type RateLimitConfig = {
  limit: number;
  windowMs: number;
  message?: string;
};

/**
 * Rate limit presets for different endpoint types
 */
export const RATE_LIMITS = {
  // Authentication endpoints - strict limits
  AUTH_LOGIN: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
  AUTH_REGISTER: {
    limit: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many registration attempts. Please try again later.',
  },
  AUTH_PASSWORD_RESET: {
    limit: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many password reset requests. Please try again later.',
  },
  AUTH_VERIFY_EMAIL: {
    limit: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many verification attempts. Please try again later.',
  },
  
  // Write operations - moderate limits
  WRITE_OPERATIONS: {
    limit: 30,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.',
  },
  
  // Read operations - generous limits
  READ_OPERATIONS: {
    limit: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please slow down.',
  },
  
  // Authenticated user operations
  AUTHENTICATED_USER: {
    limit: 300,
    windowMs: 60 * 1000, // 1 minute
    message: 'Rate limit exceeded. Please try again shortly.',
  },
  
  // Public endpoints
  PUBLIC_ENDPOINT: {
    limit: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please try again later.',
  },
  
  // Payment operations - very strict
  PAYMENT_OPERATIONS: {
    limit: 10,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many payment requests. Please wait before trying again.',
  },
  
  // Webhook endpoints - high volume
  WEBHOOK: {
    limit: 1000,
    windowMs: 60 * 1000, // 1 minute
    message: 'Webhook rate limit exceeded.',
  },
  
  // Social operations - prevent spam
  SOCIAL_POST: {
    limit: 10,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many posts. Please wait before posting again.',
  },
  SOCIAL_FOLLOW: {
    limit: 20,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many follow requests. Please slow down.',
  },
  SOCIAL_LIKE: {
    limit: 50,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many likes. Please slow down.',
  },
  
  // File upload operations
  FILE_UPLOAD: {
    limit: 10,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many file uploads. Please wait before uploading again.',
  },
} as const;

/**
 * Get rate limit configuration by endpoint type
 */
export function getRateLimitConfig(type: keyof typeof RATE_LIMITS): RateLimitConfig {
  return RATE_LIMITS[type];
}

/**
 * Rate limit identifier strategies
 */
export const RateLimitIdentifiers = {
  /**
   * Use IP address for unauthenticated requests
   */
  byIP: (ip: string) => `ip:${ip}`,
  
  /**
   * Use user ID for authenticated requests
   */
  byUserId: (userId: string) => `user:${userId}`,
  
  /**
   * Use email for email-based operations
   */
  byEmail: (email: string) => `email:${email}`,
  
  /**
   * Use custom identifier
   */
  custom: (prefix: string, id: string) => `${prefix}:${id}`,
  
  /**
   * Combine IP and user ID for extra security
   */
  combined: (ip: string, userId?: string) => 
    userId ? `combined:${ip}:${userId}` : `ip:${ip}`,
} as const;
