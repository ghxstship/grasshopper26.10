import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /memberships/join
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

    // Get available membership tiers
    const tiers = await prisma.membershipTier.findMany({
      where: { active: true },
      orderBy: { price: 'asc' },
    });

    // Check if user already has a membership
    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: context.userId,
        status: 'ACTIVE',
      },
      include: {
        tier: true,
      },
    });

    return successResponse({
      tiers,
      currentMembership: existingMembership,
      canJoin: !existingMembership,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

