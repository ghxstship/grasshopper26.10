/**
 * Response Compression Utilities
 * Handles compression for API responses
 */

import { NextResponse } from 'next/server';

/**
 * Compress response data if it exceeds threshold
 */
export function compressResponse(data: any, threshold: number = 1024): NextResponse {
  const jsonString = JSON.stringify(data);
  const size = Buffer.byteLength(jsonString, 'utf8');

  // Only compress if data exceeds threshold
  if (size < threshold) {
    return NextResponse.json(data);
  }

  // Return with compression hint header
  return NextResponse.json(data, {
    headers: {
      'Content-Encoding': 'gzip',
      'Content-Length': size.toString(),
    },
  });
}

/**
 * Add cache headers to response
 */
export function addCacheHeaders(
  response: NextResponse,
  options: {
    maxAge?: number;
    sMaxAge?: number;
    staleWhileRevalidate?: number;
    public?: boolean;
  } = {}
): NextResponse {
  const {
    maxAge = 60,
    sMaxAge = 300,
    staleWhileRevalidate = 600,
    public: isPublic = true,
  } = options;

  const cacheControl = [
    isPublic ? 'public' : 'private',
    `max-age=${maxAge}`,
    `s-maxage=${sMaxAge}`,
    `stale-while-revalidate=${staleWhileRevalidate}`,
  ].join(', ');

  response.headers.set('Cache-Control', cacheControl);
  return response;
}
