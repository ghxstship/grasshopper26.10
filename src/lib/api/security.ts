import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security Headers Configuration
 * Implements best practices for API security
 */

export const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  
  // Content Security Policy (API routes)
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
} as const;

/**
 * CORS Configuration
 */
export const CORS_CONFIG = {
  // Allowed origins (configure per environment)
  allowedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'https://gvteway.com',
    'https://www.gvteway.com',
    'https://compvss.com',
    'https://atlvs.com',
  ],
  
  // Allowed methods
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
  ],
  
  // Exposed headers
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  
  // Credentials
  credentials: true,
  
  // Max age for preflight cache
  maxAge: 86400, // 24 hours
} as const;

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(
  response: NextResponse,
  origin: string | null
): NextResponse {
  // Check if origin is allowed
  const isAllowedOrigin = origin && CORS_CONFIG.allowedOrigins.includes(origin);
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  response.headers.set(
    'Access-Control-Allow-Methods',
    CORS_CONFIG.allowedMethods.join(', ')
  );
  
  response.headers.set(
    'Access-Control-Allow-Headers',
    CORS_CONFIG.allowedHeaders.join(', ')
  );
  
  response.headers.set(
    'Access-Control-Expose-Headers',
    CORS_CONFIG.exposedHeaders.join(', ')
  );
  
  response.headers.set(
    'Access-Control-Max-Age',
    CORS_CONFIG.maxAge.toString()
  );
  
  return response;
}

/**
 * Handle CORS preflight requests
 */
export function handleCorsPreflightRequest(request: NextRequest): NextResponse {
  const origin = request.headers.get('origin');
  const response = new NextResponse(null, { status: 204 });
  
  addCorsHeaders(response, origin);
  addSecurityHeaders(response);
  
  return response;
}

/**
 * Wrap response with security and CORS headers
 */
export function secureResponse(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const origin = request.headers.get('origin');
  
  addSecurityHeaders(response);
  addCorsHeaders(response, origin);
  
  return response;
}

/**
 * Request size limits (in bytes)
 */
export const REQUEST_SIZE_LIMITS = {
  // Default limit for most endpoints
  DEFAULT: 1024 * 1024, // 1 MB
  
  // File upload endpoints
  FILE_UPLOAD: 10 * 1024 * 1024, // 10 MB
  
  // Image upload endpoints
  IMAGE_UPLOAD: 5 * 1024 * 1024, // 5 MB
  
  // JSON payloads
  JSON: 100 * 1024, // 100 KB
  
  // Webhook endpoints
  WEBHOOK: 500 * 1024, // 500 KB
} as const;

/**
 * Validate request body size
 */
export function validateRequestSize(
  contentLength: string | null,
  maxSize: number = REQUEST_SIZE_LIMITS.DEFAULT
): boolean {
  if (!contentLength) {
    return true; // Allow if no content-length header
  }
  
  const size = parseInt(contentLength, 10);
  return !isNaN(size) && size <= maxSize;
}

/**
 * Webhook signature validation helpers
 */
export const WebhookValidation = {
  /**
   * Validate Stripe webhook signature
   * NOTE: Import from webhook-validation.ts for actual implementation
   * This is a placeholder to avoid Edge Runtime issues
   */
  stripe: async (_payload: string, _signature: string, _secret: string): Promise<boolean> => {
    throw new Error('Use validateStripeWebhook from webhook-validation.ts instead');
  },
  
  /**
   * Validate SendGrid webhook signature
   * NOTE: Import from webhook-validation.ts for actual implementation
   * This is a placeholder to avoid Edge Runtime issues
   */
  sendgrid: async (_payload: string, _signature: string, _publicKey: string): Promise<boolean> => {
    throw new Error('Use validateSendGridWebhook from webhook-validation.ts instead');
  },
  
  /**
   * Validate Twilio webhook signature
   * NOTE: Import from webhook-validation.ts for actual implementation
   * This is a placeholder to avoid Edge Runtime issues
   */
  twilio: async (_url: string, _params: Record<string, string>, _signature: string, _authToken: string): Promise<boolean> => {
    throw new Error('Use validateTwilioWebhook from webhook-validation.ts instead');
  },
} as const;
