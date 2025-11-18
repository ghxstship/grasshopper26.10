import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Extract subdomain
  // For local development: localhost:3000 or 127.0.0.1:3000
  // For production: subdomain.gvteway.one
  let subdomain = '';
  
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Local development - check for subdomain in custom header or use path-based routing
    // You can test with: app.localhost:3000, atlvs.localhost:3000, compass.localhost:3000
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'localhost' && parts[0] !== '127') {
      subdomain = parts[0];
    }
  } else {
    // Production - extract subdomain from gvteway.one
    const parts = hostname.split('.');
    
    // Handle different domain patterns:
    // - gvteway.one (main marketing site)
    // - app.gvteway.one (GVTEWAY app)
    // - atlvs.gvteway.one (ATLVS app)
    // - compass.gvteway.one (COMPVSS app)
    
    if (parts.length >= 3) {
      // Has subdomain
      subdomain = parts[0];
    } else if (parts.length === 2 && parts[0] === 'gvteway') {
      // Main domain - no subdomain
      subdomain = '';
    }
  }

  // Route based on subdomain
  switch (subdomain) {
    case 'app':
      // GVTEWAY authenticated app
      // Rewrite /anything to /gvteway/anything
      if (!url.pathname.startsWith('/gvteway')) {
        url.pathname = `/gvteway${url.pathname}`;
        return NextResponse.rewrite(url);
      }
      break;

    case 'atlvs':
      // ATLVS authenticated app
      // Rewrite /anything to /atlvs/anything (but skip /atlvs itself to avoid double prefix)
      if (!url.pathname.startsWith('/atlvs')) {
        // If accessing root, go to projects dashboard
        if (url.pathname === '/') {
          url.pathname = '/atlvs/projects';
        } else {
          url.pathname = `/atlvs${url.pathname}`;
        }
        return NextResponse.rewrite(url);
      }
      break;

    case 'compass':
      // COMPVSS authenticated app
      // Rewrite /anything to /compvss/anything
      if (!url.pathname.startsWith('/compvss')) {
        // If accessing root, go to dashboard
        if (url.pathname === '/') {
          url.pathname = '/compvss/dashboard';
        } else {
          url.pathname = `/compvss${url.pathname}`;
        }
        return NextResponse.rewrite(url);
      }
      break;

    default:
      // Main marketing site (gvteway.one)
      // Keep marketing pages at root level
      // /atlvs and /compvss are marketing pages
      // / is GVTEWAY marketing page
      break;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
