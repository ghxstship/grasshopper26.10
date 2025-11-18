import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { errors } from './response';

export type RequestContext = {
  userId: string;
  userRole: string;
  userEmail: string;
  organizationId?: string;
};

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limiting middleware
 * @param identifier - Unique identifier for rate limiting (e.g., IP address, user ID)
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if request is allowed, false if rate limit exceeded
 */
export function rateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * Get client identifier from request headers
 * @param request - NextRequest object
 * @returns Client IP address or 'unknown'
 */
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * Validate request and extract user context from NextAuth session
 * @param request - NextRequest object
 * @returns RequestContext with user information
 * @throws Unauthorized error if no valid session
 */
export async function validateRequest(_request: NextRequest): Promise<RequestContext> {
  const session = await auth();
  
  if (!session || !session.user) {
    throw errors.unauthorized();
  }

  if (!session.user.id || !session.user.email || !session.user.role) {
    throw errors.unauthorized();
  }
  
  return {
    userId: session.user.id,
    userRole: session.user.role,
    userEmail: session.user.email,
    organizationId: undefined, // Can be set by specific routes if needed
  };
}

/**
 * Require authentication - throws if user is not authenticated
 * @param context - RequestContext from validateRequest
 * @throws Unauthorized error if userId is missing
 */
export function requireAuth(context: RequestContext): asserts context is RequestContext {
  if (!context.userId) {
    throw errors.unauthorized();
  }
}

/**
 * Require specific role(s) - throws if user doesn't have required role
 * @param context - RequestContext from validateRequest
 * @param allowedRoles - Array of allowed role strings
 * @throws Forbidden error if user doesn't have required role
 */
export function requireRole(context: RequestContext, allowedRoles: string[]): void {
  requireAuth(context);
  
  if (!context.userRole || !allowedRoles.includes(context.userRole)) {
    throw errors.forbidden();
  }
}

/**
 * Parse request body
 * @param request - NextRequest object
 * @returns Parsed JSON body
 */
export async function parseBody<T = unknown>(request: NextRequest): Promise<T> {
  try {
    return await request.json() as T;
  } catch {
    throw errors.badRequest('Invalid JSON in request body');
  }
}

export function parseQuery<T>(request: NextRequest, schema: { parse: (data: unknown) => T }): T {
  const { searchParams } = new URL(request.url);
  const query: Record<string, unknown> = {};
  
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  
  return schema.parse(query);
}

export function getPaginationParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
}

export function getSortParams(request: NextRequest, defaultSort: string = 'createdAt') {
  const { searchParams } = new URL(request.url);
  
  const sortBy = searchParams.get('sortBy') || defaultSort;
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';
  
  return { sortBy, sortOrder };
}

export function getFilterParams(request: NextRequest, allowedFilters: string[]) {
  const { searchParams } = new URL(request.url);
  const filters: Record<string, string> = {};
  
  for (const filter of allowedFilters) {
    const value = searchParams.get(filter);
    if (value !== null) {
      filters[filter] = value;
    }
  }
  
  return filters;
}
