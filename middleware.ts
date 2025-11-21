/**
 * Next.js Middleware
 * Handles authentication and authorization for protected routes
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { hasEventRolePlatformAccess } from '@/lib/rbac/event-roles';

// Define protected route patterns
const PROTECTED_ROUTES = {
  ATLVS: /^\/atlvs(?!\/auth)/,
  COMPVSS: /^\/compvss(?!\/auth)/,
  GVTEWAY: /^\/gvteway(?!\/auth)/,
};

// Define role-based access for each platform (base platform roles)
const PLATFORM_ROLES = {
  ATLVS: [
    'INTERNAL_TEAM',
    'ADMIN',
    'SUPER_ADMIN',
    // Legend roles
    'LEGEND_SUPER_ADMIN',
    'LEGEND_ADMIN',
    'LEGEND_DEVELOPER',
    'LEGEND_COLLABORATOR',
    'LEGEND_SUPPORT',
    // All Platforms event roles
    'EXECUTIVE',
    'CORE_AAA',
    'AA',
    'PRODUCTION',
    'MANAGEMENT',
  ],
  COMPVSS: [
    'EXTERNAL_TEAM',
    'ADMIN',
    'SUPER_ADMIN',
    // Legend roles
    'LEGEND_SUPER_ADMIN',
    'LEGEND_ADMIN',
    'LEGEND_DEVELOPER',
    'LEGEND_COLLABORATOR',
    'LEGEND_SUPPORT',
    // All Platforms event roles
    'EXECUTIVE',
    'CORE_AAA',
    'AA',
    'PRODUCTION',
    'MANAGEMENT',
    // COMPVSS event roles
    'CREW',
    'STAFF',
    'VENDOR',
    'ENTERTAINER',
    'ARTIST',
    'AGENT',
    'MEDIA',
    'SPONSOR',
    'PARTNER',
    'INDUSTRY',
    'INTERN',
    'VOLUNTEER',
  ],
  GVTEWAY: [
    'CONSUMER',
    'ADMIN',
    'SUPER_ADMIN',
    'ORGANIZER',
    // Legend roles
    'LEGEND_SUPER_ADMIN',
    'LEGEND_ADMIN',
    'LEGEND_DEVELOPER',
    'LEGEND_COLLABORATOR',
    'LEGEND_SUPPORT',
    // All Platforms event roles
    'EXECUTIVE',
    'CORE_AAA',
    'AA',
    'PRODUCTION',
    'MANAGEMENT',
    // GVTEWAY event roles
    'GUEST',
    'BACKSTAGE_L1',
    'BACKSTAGE_L2',
    'PLATINUM_VIP_L1',
    'PLATINUM_VIP_L2',
    'VIP_L1',
    'VIP_L2',
    'VIP_L3',
    'GA_L1',
    'GA_L2',
    'GA_L3',
    'GA_L4',
    'GA_L5',
    'INFLUENCER',
    'BRAND_AMBASSADOR',
    'AFFILIATE',
    // Cross-platform event roles
    'ENTERTAINER',
    'ARTIST',
    'MEDIA',
    'SPONSOR',
    'PARTNER',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/static') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)
  ) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isAtlvsRoute = PROTECTED_ROUTES.ATLVS.test(pathname);
  const isCompvssRoute = PROTECTED_ROUTES.COMPVSS.test(pathname);
  const isGvtewayRoute = PROTECTED_ROUTES.GVTEWAY.test(pathname);

  if (!isAtlvsRoute && !isCompvssRoute && !isGvtewayRoute) {
    return NextResponse.next();
  }

  // Get session
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  const userRole = session.user.role as string;

  // Check platform access using both static role list and event role system
  if (isAtlvsRoute) {
    const hasAccess = PLATFORM_ROLES.ATLVS.includes(userRole) || 
                     hasEventRolePlatformAccess(userRole, 'ATLVS');
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (isCompvssRoute) {
    const hasAccess = PLATFORM_ROLES.COMPVSS.includes(userRole) || 
                     hasEventRolePlatformAccess(userRole, 'COMPVSS');
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (isGvtewayRoute) {
    const hasAccess = PLATFORM_ROLES.GVTEWAY.includes(userRole) || 
                     hasEventRolePlatformAccess(userRole, 'GVTEWAY');
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
