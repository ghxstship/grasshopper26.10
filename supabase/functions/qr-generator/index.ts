/**
 * QR Code Generator Edge Function
 * Generates QR codes for tickets, check-ins, and authentication
 * Returns QR code as PNG or SVG
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCorsPreFlight } from '../_shared/cors.ts';
import { requireAuth } from '../_shared/auth.ts';
import { errorResponse, handleError } from '../_shared/response.ts';
import { checkRateLimit, getRateLimitIdentifier, addRateLimitHeaders } from '../_shared/rate-limit.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreFlight();
  }

  try {
    // Authenticate user
    const user = await requireAuth(req);

    // Rate limiting
    const identifier = getRateLimitIdentifier(req, user.id);
    const rateLimit = checkRateLimit(identifier, { maxRequests: 50, windowMs: 60000 });

    if (!rateLimit.allowed) {
      const response = errorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        429
      );
      return addRateLimitHeaders(response, {
        ...rateLimit,
        maxRequests: 50,
      });
    }

    const url = new URL(req.url);
    const data = url.searchParams.get('data');
    const format = url.searchParams.get('format') || 'png';
    const size = parseInt(url.searchParams.get('size') || '300');

    if (!data) {
      return errorResponse('INVALID_REQUEST', 'Missing data parameter', 400);
    }

    if (size < 100 || size > 1000) {
      return errorResponse('INVALID_REQUEST', 'Size must be between 100 and 1000', 400);
    }

    // Generate QR code using external API (qrcode.show or similar)
    // For production, consider using a library or service
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=${size}x${size}&format=${format}`;

    const qrResponse = await fetch(qrApiUrl);

    if (!qrResponse.ok) {
      return errorResponse('QR_GENERATION_FAILED', 'Failed to generate QR code', 500);
    }

    const qrBuffer = await qrResponse.arrayBuffer();

    const headers = new Headers({
      'Content-Type': format === 'svg' ? 'image/svg+xml' : 'image/png',
      'Cache-Control': 'public, max-age=86400',
      'X-QR-Size': size.toString(),
      'X-QR-Format': format,
    });

    const response = new Response(qrBuffer, {
      status: 200,
      headers,
    });

    return addRateLimitHeaders(response, {
      ...rateLimit,
      maxRequests: 50,
    });
  } catch (error) {
    return handleError(error);
  }
});
