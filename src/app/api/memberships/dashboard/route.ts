import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /memberships/dashboard
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

    // Get active membership
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
      });
    }

    // Get membership usage stats
    const ticketsPurchased = await prisma.ticket.count({
      where: {
        userId: context.userId,
        createdAt: { gte: membership.startDate },
      },
    });

    // Calculate savings based on fees (simplified approach)
    const totalOrders = await prisma.order.aggregate({
      where: {
        userId: context.userId,
        status: 'COMPLETED',
        createdAt: { gte: membership.startDate },
      },
      _sum: {
        fees: true,
      },
    });

    const upcomingEvents = await prisma.ticket.findMany({
      where: {
        userId: context.userId,
        event: {
          startDate: { gte: new Date() },
        },
      },
      include: {
        event: {
          include: {
            venue: true,
          },
        },
      },
      orderBy: {
        event: {
          startDate: 'asc',
        },
      },
      take: 5,
    });

    return successResponse({
      hasMembership: true,
      membership,
      stats: {
        ticketsPurchased,
        totalSavings: parseFloat((totalOrders._sum.fees || 0).toString()) * 0.1, // Estimated 10% savings
        memberSince: membership.startDate,
        daysRemaining: Math.ceil((membership.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      },
      upcomingEvents,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

