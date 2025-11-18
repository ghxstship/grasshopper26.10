import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { addSecurityHeaders, addCorsHeaders, handleCorsPreflightRequest } from "@/lib/api/security";

// Define public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/error",
  "/api/auth",
];

// Define platform-specific route prefixes
const platformRoutes = {
  GVTEWAY: ["/gvteway"],
  COMPVSS: ["/compvss"],
  ATLVS: ["/atlvs"],
};

/**
 * Check if a path matches any of the given patterns
 */
function matchesPattern(path: string, patterns: string[]): boolean {
  return patterns.some((pattern) => path.startsWith(pattern));
}

/**
 * Check if route is public
 */
function isPublicRoute(path: string): boolean {
  return publicRoutes.some((route) => path.startsWith(route));
}

/**
 * Get required role for a platform route
 */
function getRequiredRole(path: string): string | null {
  if (matchesPattern(path, platformRoutes.GVTEWAY)) {
    return "CONSUMER";
  }
  if (matchesPattern(path, platformRoutes.COMPVSS)) {
    return "EXTERNAL_TEAM";
  }
  if (matchesPattern(path, platformRoutes.ATLVS)) {
    return "INTERNAL_TEAM";
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // ============================================================================
  // SUBDOMAIN ROUTING - Handle before authentication
  // ============================================================================
  let subdomain = '';
  
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Local development - check for subdomain
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'localhost' && parts[0] !== '127') {
      subdomain = parts[0];
    }
  } else {
    // Production - extract subdomain from gvteway.one
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      subdomain = parts[0];
    }
  }

  // Route based on subdomain
  if (subdomain) {
    switch (subdomain) {
      case 'app':
        // GVTEWAY authenticated app
        if (!pathname.startsWith('/gvteway')) {
          url.pathname = `/gvteway${pathname}`;
          return NextResponse.rewrite(url);
        }
        break;

      case 'atlvs':
        // ATLVS authenticated app
        if (!pathname.startsWith('/atlvs')) {
          if (pathname === '/') {
            url.pathname = '/atlvs/projects';
          } else {
            url.pathname = `/atlvs${pathname}`;
          }
          return NextResponse.rewrite(url);
        }
        break;

      case 'compass':
        // COMPVSS authenticated app
        if (!pathname.startsWith('/compvss')) {
          if (pathname === '/') {
            url.pathname = '/compvss/dashboard';
          } else {
            url.pathname = `/compvss${pathname}`;
          }
          return NextResponse.rewrite(url);
        }
        break;
    }
  }

  // ============================================================================
  // CORS & SECURITY HEADERS
  // ============================================================================
  
  // Handle CORS preflight requests for API routes
  if (pathname.startsWith("/api") && request.method === "OPTIONS") {
    return handleCorsPreflightRequest(request);
  }

  // Add security headers and CORS to all API responses
  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();
    const origin = request.headers.get("origin");
    addSecurityHeaders(response);
    addCorsHeaders(response, origin);
    return response;
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Allow static files
  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Get the user's token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for platform routes
  const requiredRole = getRequiredRole(pathname);
  
  if (requiredRole) {
    const userRole = token.role as string;
    
    // Admin has access to all platforms
    if (userRole === "ADMIN") {
      return NextResponse.next();
    }
    
    // Check if user has the required role
    if (userRole !== requiredRole) {
      // Redirect to appropriate platform based on user's role
      let redirectPath = "/";
      
      switch (userRole) {
        case "CONSUMER":
          redirectPath = "/gvteway/dashboard";
          break;
        case "EXTERNAL_TEAM":
          redirectPath = "/compvss/dashboard";
          break;
        case "INTERNAL_TEAM":
          redirectPath = "/atlvs/dashboard";
          break;
      }
      
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  // Check email verification for sensitive routes
  if (pathname.startsWith("/gvteway/wallet") || pathname.startsWith("/compvss/advancing")) {
    if (!token.emailVerified) {
      return NextResponse.redirect(new URL("/auth/verify-email", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
