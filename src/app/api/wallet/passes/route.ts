import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /api/wallet/passes - Get user's digital passes
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

    const passes = await prisma.walletPass.findMany({
      where: {
        ticket: {
          userId: context.userId,
        },
      },
      include: {
        ticket: {
          include: {
            event: {
              select: {
                id: true,
                name: true,
                startDate: true,
                venue: {
                  select: {
                    name: true,
                    city: true,
                  },
                },
              },
            },
            ticketType: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse({ passes });
  } catch (error) {
    return handleApiError(error);
  }
}
