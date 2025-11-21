import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /memberships/exclusive
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

    // Get user's active membership
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
      throw errors.forbidden('Active membership required');
    }

    // Get upcoming published events for members
    const exclusiveEvents = await prisma.event.findMany({
      where: {
        startDate: { gte: new Date() },
        status: 'PUBLISHED',
      },
      include: {
        venue: true,
        category: true,
      },
      orderBy: { startDate: 'asc' },
      take: 20,
    });

    return successResponse({
      membership,
      exclusiveEvents,
      tierName: membership.tier.name,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

