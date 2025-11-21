import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /api/wallet/loyalty - Get user's loyalty points
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.PUBLIC_ENDPOINT.limit,
      RATE_LIMITS.PUBLIC_ENDPOINT.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const loyaltyPoints = await prisma.loyaltyPoints.findUnique({
      where: {
        userId: context.userId,
      },
    });

    const totalPoints = loyaltyPoints?.points || 0;

    return successResponse({ 
      loyaltyPoints,
      totalPoints,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
