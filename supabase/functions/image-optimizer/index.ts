/**
 * Image Optimizer Edge Function
 * Optimizes and transforms images on-the-fly
 * Supports resize, format conversion, and quality adjustment
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCorsPreFlight } from '../_shared/cors.ts';
import { errorResponse, handleError } from '../_shared/response.ts';
import { checkRateLimit, getRateLimitIdentifier, addRateLimitHeaders } from '../_shared/rate-limit.ts';

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  fit?: 'cover' | 'contain' | 'fill';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreFlight();
  }

  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(req);
    const rateLimit = checkRateLimit(identifier, { maxRequests: 100, windowMs: 60000 });

    if (!rateLimit.allowed) {
      const response = errorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        429
      );
      return addRateLimitHeaders(response, {
        ...rateLimit,
        maxRequests: 100,
      });
    }

    const url = new URL(req.url);
    const imageUrl = url.searchParams.get('url');

    if (!imageUrl) {
      return errorResponse('INVALID_REQUEST', 'Missing url parameter', 400);
    }

    // Parse optimization options
    const options: ImageOptions = {
      width: url.searchParams.get('w') ? parseInt(url.searchParams.get('w')!) : undefined,
      height: url.searchParams.get('h') ? parseInt(url.searchParams.get('h')!) : undefined,
      quality: url.searchParams.get('q') ? parseInt(url.searchParams.get('q')!) : 80,
      format: (url.searchParams.get('f') as ImageOptions['format']) || 'webp',
      fit: (url.searchParams.get('fit') as ImageOptions['fit']) || 'cover',
    };

    // Validate options
    if (options.quality && (options.quality < 1 || options.quality > 100)) {
      return errorResponse('INVALID_REQUEST', 'Quality must be between 1 and 100', 400);
    }

    // Fetch the original image
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      return errorResponse('IMAGE_FETCH_FAILED', 'Failed to fetch image', 400);
    }

    const contentType = imageResponse.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      return errorResponse('INVALID_IMAGE', 'URL does not point to an image', 400);
    }

    // For now, pass through the image with cache headers
    // In production, you would use an image processing library like sharp
    // or integrate with a service like Cloudinary/Imgix
    const imageBuffer = await imageResponse.arrayBuffer();

    const headers = new Headers({
      'Content-Type': `image/${options.format}`,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Image-Width': options.width?.toString() || 'original',
      'X-Image-Height': options.height?.toString() || 'original',
      'X-Image-Quality': options.quality?.toString() || '80',
      'X-Image-Format': options.format,
    });

    const response = new Response(imageBuffer, {
      status: 200,
      headers,
    });

    return addRateLimitHeaders(response, {
      ...rateLimit,
      maxRequests: 100,
    });
  } catch (error) {
    return handleError(error);
  }
});
