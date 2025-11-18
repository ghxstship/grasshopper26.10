/**
 * Pagination Middleware
 * Automatically adds pagination support to list endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import { parsePaginationParams, createPaginatedResponse } from '@/lib/performance/pagination';

/**
 * Routes that should have automatic pagination
 */
const PAGINATED_ROUTES = [
  '/api/events',
  '/api/tickets',
  '/api/orders',
  '/api/products',
  '/api/atlvs/projects',
  '/api/atlvs/tasks',
  '/api/atlvs/advancing',
  '/api/compvss/teams',
  '/api/compvss/expenses',
  '/api/gvteway/marketplace',
  '/api/social/posts',
  '/api/social/comments',
];

/**
 * Check if route should be paginated
 */
export function shouldPaginate(pathname: string): boolean {
  return PAGINATED_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Extract pagination parameters from request
 */
export function getPaginationParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  return parsePaginationParams(searchParams);
}

/**
 * Wrap response with pagination metadata
 */
export function withPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse {
  const paginatedData = createPaginatedResponse(data, page, limit, total);
  return NextResponse.json(paginatedData);
}

/**
 * Add pagination headers to response
 */
export function addPaginationHeaders(
  response: NextResponse,
  page: number,
  limit: number,
  total: number,
  baseUrl: string
): NextResponse {
  const totalPages = Math.ceil(total / limit);
  
  // Add Link header for pagination
  const links: string[] = [];
  
  if (page > 1) {
    links.push(`<${baseUrl}?page=1&limit=${limit}>; rel="first"`);
    links.push(`<${baseUrl}?page=${page - 1}&limit=${limit}>; rel="prev"`);
  }
  
  if (page < totalPages) {
    links.push(`<${baseUrl}?page=${page + 1}&limit=${limit}>; rel="next"`);
    links.push(`<${baseUrl}?page=${totalPages}&limit=${limit}>; rel="last"`);
  }
  
  if (links.length > 0) {
    response.headers.set('Link', links.join(', '));
  }
  
  // Add custom pagination headers
  response.headers.set('X-Total-Count', total.toString());
  response.headers.set('X-Total-Pages', totalPages.toString());
  response.headers.set('X-Current-Page', page.toString());
  response.headers.set('X-Per-Page', limit.toString());
  
  return response;
}
