/**
 * Auth Validator Edge Function
 * Validates JWT tokens and returns user information
 * Used for client-side authentication checks
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCorsPreFlight } from '../_shared/cors.ts';
import { verifyAuth } from '../_shared/auth.ts';
import { successResponse, errorResponse, handleError } from '../_shared/response.ts';
import { checkRateLimit, getRateLimitIdentifier, addRateLimitHeaders } from '../_shared/rate-limit.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreFlight();
  }

  try {
    // Rate limiting
    const identifier = getRateLimitIdentifier(req);
    const rateLimit = checkRateLimit(identifier, { maxRequests: 60, windowMs: 60000 });

    if (!rateLimit.allowed) {
      const response = errorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        429
      );
      return addRateLimitHeaders(response, {
        ...rateLimit,
        maxRequests: 60,
      });
    }

    // Verify authentication
    const user = await verifyAuth(req);

    if (!user) {
      return errorResponse('UNAUTHORIZED', 'Invalid or expired token', 401);
    }

    // Return user information
    const response = successResponse({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });

    return addRateLimitHeaders(response, {
      ...rateLimit,
      maxRequests: 60,
    });
  } catch (error) {
    return handleError(error);
  }
});
