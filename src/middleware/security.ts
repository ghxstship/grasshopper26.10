import { NextRequest, NextResponse } from 'next/server';

/**
 * Security Middleware
 * Implements CSP, CORS, security headers, and rate limiting
 */

// Content Security Policy
const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-eval'", // Required for Next.js
    "'unsafe-inline'", // Required for styled-components
    'https://cdn.jsdelivr.net',
    'https://unpkg.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
    'https://*.supabase.co',
    'https://*.stripe.com',
  ],
  'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://api.stripe.com',
    'https://api.twilio.com',
  ],
  'frame-src': ["'self'", 'https://js.stripe.com', 'https://hooks.stripe.com'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

function buildCSP(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
}

// CORS Configuration
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  // Add production domains
  'https://atlvs.app',
  'https://compvss.app',
  'https://gvteway.app',
].filter(Boolean) as string[];

const CORS_HEADERS = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With, X-API-Key, X-Client-ID',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Access-Control-Allow-Credentials': 'true',
};

// Security Headers
const SECURITY_HEADERS = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  
  // HSTS (HTTP Strict Transport Security)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

// Rate limiting store (in-memory, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/auth/login': { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 per 15min
  '/api/auth/register': { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour
  '/api/auth/forgot-password': { windowMs: 60 * 60 * 1000, maxRequests: 3 },
  '/api': { windowMs: 60 * 1000, maxRequests: 100 }, // 100 per minute (default)
};

function getRateLimitKey(ip: string, path: string): string {
  return `${ip}:${path}`;
}

function checkRateLimit(
  ip: string,
  path: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const key = getRateLimitKey(ip, path);
  const now = Date.now();
  
  let entry = rateLimitStore.get(key);
  
  // Reset if window expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
  }
  
  entry.count++;
  rateLimitStore.set(key, entry);
  
  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  
  return { allowed, remaining, resetAt: entry.resetAt };
}

function getRateLimitConfig(path: string): RateLimitConfig {
  // Find most specific matching config
  for (const [pattern, config] of Object.entries(RATE_LIMITS)) {
    if (path.startsWith(pattern)) {
      return config;
    }
  }
  
  // Default rate limit
  return { windowMs: 60 * 1000, maxRequests: 100 };
}

// Session timeout (30 minutes of inactivity)
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

function checkSessionTimeout(request: NextRequest): boolean {
  const lastActivity = request.cookies.get('last_activity')?.value;
  
  if (!lastActivity) return false;
  
  const lastActivityTime = parseInt(lastActivity, 10);
  const now = Date.now();
  
  return now - lastActivityTime > SESSION_TIMEOUT_MS;
}

/**
 * Main security middleware
 */
export function securityMiddleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  
  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return handleCORS(request, new NextResponse(null, { status: 204 }));
  }
  
  // Check session timeout for authenticated routes
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    if (checkSessionTimeout(request)) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }
  }
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const config = getRateLimitConfig(pathname);
    const { allowed, remaining, resetAt } = checkRateLimit(ip, pathname, config);
    
    if (!allowed) {
      const response = NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
        },
        { status: 429 }
      );
      
      response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', '0');
      response.headers.set('X-RateLimit-Reset', resetAt.toString());
      response.headers.set('Retry-After', Math.ceil((resetAt - Date.now()) / 1000).toString());
      
      return handleCORS(request, response);
    }
    
    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', resetAt.toString());
    
    return addSecurityHeaders(handleCORS(request, response));
  }
  
  // Add security headers to all responses
  const response = NextResponse.next();
  return addSecurityHeaders(handleCORS(request, response));
}

/**
 * Add CORS headers
 */
function handleCORS(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin');
  
  // Check if origin is allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    
    // Add other CORS headers
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  return response;
}

/**
 * Add security headers
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Add CSP
  response.headers.set('Content-Security-Policy', buildCSP());
  
  // Add other security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Update last activity timestamp
  response.cookies.set('last_activity', Date.now().toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_TIMEOUT_MS / 1000,
  });
  
  return response;
}

/**
 * IP Whitelisting for admin endpoints
 */
const ADMIN_IP_WHITELIST = (process.env.ADMIN_IP_WHITELIST || '').split(',').filter(Boolean);

export function checkAdminIPWhitelist(request: NextRequest): boolean {
  if (ADMIN_IP_WHITELIST.length === 0) return true; // No whitelist configured
  
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
  return ADMIN_IP_WHITELIST.includes(ip);
}

/**
 * Brute force protection
 */
const bruteForceStore = new Map<string, { attempts: number; lockedUntil: number }>();

export function checkBruteForce(
  identifier: string,
  maxAttempts: number = 5,
  lockoutDurationMs: number = 15 * 60 * 1000
): { allowed: boolean; attemptsRemaining: number; lockedUntil?: number } {
  const now = Date.now();
  let entry = bruteForceStore.get(identifier);
  
  // Reset if lockout expired
  if (entry && entry.lockedUntil < now) {
    entry = undefined;
    bruteForceStore.delete(identifier);
  }
  
  // Check if locked
  if (entry && entry.lockedUntil > now) {
    return {
      allowed: false,
      attemptsRemaining: 0,
      lockedUntil: entry.lockedUntil,
    };
  }
  
  // Initialize or increment attempts
  if (!entry) {
    entry = { attempts: 0, lockedUntil: 0 };
  }
  
  entry.attempts++;
  
  // Lock if max attempts exceeded
  if (entry.attempts >= maxAttempts) {
    entry.lockedUntil = now + lockoutDurationMs;
    bruteForceStore.set(identifier, entry);
    
    return {
      allowed: false,
      attemptsRemaining: 0,
      lockedUntil: entry.lockedUntil,
    };
  }
  
  bruteForceStore.set(identifier, entry);
  
  return {
    allowed: true,
    attemptsRemaining: maxAttempts - entry.attempts,
  };
}

export function resetBruteForce(identifier: string): void {
  bruteForceStore.delete(identifier);
}

/**
 * Request signing for sensitive operations
 */
import { createHmac } from 'crypto';

export function signRequest(payload: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

export function verifyRequestSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = signRequest(payload, secret);
  return signature === expectedSignature;
}

/**
 * API Key rotation
 */
interface APIKey {
  key: string;
  createdAt: number;
  expiresAt: number;
  rotatedFrom?: string;
}

const apiKeyStore = new Map<string, APIKey>();

export function rotateAPIKey(
  oldKey: string,
  gracePeriodMs: number = 7 * 24 * 60 * 60 * 1000 // 7 days
): string {
  const newKey = generateAPIKey();
  const now = Date.now();
  
  // Create new key
  apiKeyStore.set(newKey, {
    key: newKey,
    createdAt: now,
    expiresAt: now + 365 * 24 * 60 * 60 * 1000, // 1 year
  });
  
  // Mark old key for rotation
  const oldKeyData = apiKeyStore.get(oldKey);
  if (oldKeyData) {
    oldKeyData.expiresAt = now + gracePeriodMs;
    apiKeyStore.set(oldKey, oldKeyData);
  }
  
  return newKey;
}

function generateAPIKey(): string {
  return `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

export function validateAPIKey(key: string): boolean {
  const keyData = apiKeyStore.get(key);
  if (!keyData) return false;
  
  return keyData.expiresAt > Date.now();
}
