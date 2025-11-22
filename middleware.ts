/**
 * Next.js Middleware
 * Handles authentication and authorization for protected routes
 * 
 * IMPORTANT: This runs on Edge Runtime with NO access to Node.js APIs or Prisma
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

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

// Event role platform access mapping (edge-compatible, no external dependencies)
const EVENT_ROLE_PLATFORM_ACCESS: Record<string, string[]> = {
  // All Platforms roles have access to everything
  EXECUTIVE: ['ATLVS', 'COMPVSS', 'GVTEWAY'],
  CORE_AAA: ['ATLVS', 'COMPVSS', 'GVTEWAY'],
  AA: ['ATLVS', 'COMPVSS', 'GVTEWAY'],
  PRODUCTION: ['ATLVS', 'COMPVSS', 'GVTEWAY'],
  MANAGEMENT: ['ATLVS', 'COMPVSS', 'GVTEWAY'],
  
  // COMPVSS roles
  CREW: ['COMPVSS'],
  STAFF: ['COMPVSS'],
  VENDOR: ['COMPVSS'],
  ENTERTAINER: ['COMPVSS', 'GVTEWAY'],
  ARTIST: ['COMPVSS', 'GVTEWAY'],
  AGENT: ['COMPVSS'],
  MEDIA: ['COMPVSS', 'GVTEWAY'],
  SPONSOR: ['COMPVSS', 'GVTEWAY'],
  PARTNER: ['COMPVSS', 'GVTEWAY'],
  INDUSTRY: ['COMPVSS'],
  INTERN: ['COMPVSS'],
  VOLUNTEER: ['COMPVSS'],
  
  // GVTEWAY roles
  GUEST: ['GVTEWAY'],
  BACKSTAGE_L1: ['GVTEWAY'],
  BACKSTAGE_L2: ['GVTEWAY'],
  PLATINUM_VIP_L1: ['GVTEWAY'],
  PLATINUM_VIP_L2: ['GVTEWAY'],
  VIP_L1: ['GVTEWAY'],
  VIP_L2: ['GVTEWAY'],
  VIP_L3: ['GVTEWAY'],
  GA_L1: ['GVTEWAY'],
  GA_L2: ['GVTEWAY'],
  GA_L3: ['GVTEWAY'],
  GA_L4: ['GVTEWAY'],
  GA_L5: ['GVTEWAY'],
  INFLUENCER: ['GVTEWAY'],
  BRAND_AMBASSADOR: ['GVTEWAY'],
  AFFILIATE: ['GVTEWAY'],
};

/**
 * Check if role has access to platform (edge-compatible)
 */
function hasEventRolePlatformAccess(
  role: string,
  platform: 'ATLVS' | 'COMPVSS' | 'GVTEWAY'
): boolean {
  const platforms = EVENT_ROLE_PLATFORM_ACCESS[role];
  return platforms ? platforms.includes(platform) : false;
}

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

  // Get token from JWT (edge-compatible, no database access)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  const userRole = token.role as string;

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
