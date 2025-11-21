import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /memberships/benefits
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

    // Get user's membership
    const membership = await prisma.membership.findFirst({
      where: {
        userId: context.userId,
        status: 'ACTIVE',
      },
      include: {
        tier: true,
      },
    });

    if (!membership) {
      return successResponse({
        hasMembership: false,
        benefits: [],
      });
    }

    // Parse benefits from tier metadata
    const benefits = [
      {
        id: 'early-access',
        title: 'Early Access',
        description: 'Get tickets before general public',
        active: true,
      },
      {
        id: 'exclusive-events',
        title: 'Exclusive Events',
        description: 'Access to members-only events',
        active: true,
      },
      {
        id: 'discount',
        title: '10% Discount',
        description: 'On all ticket purchases',
        active: true,
      },
    ];

    return successResponse({
      hasMembership: true,
      tier: membership.tier,
      benefits,
      memberSince: membership.startDate,
      renewalDate: membership.endDate,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

