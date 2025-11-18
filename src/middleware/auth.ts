import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

/**
 * Authentication middleware for API routes
 */
export async function authMiddleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/api/auth',
    '/api/health',
    '/api/public',
  ];

  // Check if route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get session
  const session = await getSession();

  // Reject if no session
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Add user to request headers for downstream use
  const response = NextResponse.next();
  response.headers.set('x-user-id', session.user.id);
  response.headers.set('x-user-email', session.user.email || '');

  return response;
}

/**
 * Role-based authorization middleware
 */
export function requireRole(allowedRoles: string[]) {
  return async (_request: NextRequest): Promise<NextResponse> => {
    const session = await getSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userRole = session.user.role || 'USER';

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  };
}

/**
 * Rate limiting middleware
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return NextResponse.next();
    }

    if (record.count >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    record.count++;
    return NextResponse.next();
  };
}
