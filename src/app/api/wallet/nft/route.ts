import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /api/wallet/nft - Get user's NFT collection
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

    const nfts = await prisma.nFTTicket.findMany({
      where: {
        ticket: {
          order: {
            userId: context.userId,
          },
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
                imageUrl: true,
              },
            },
            ticketType: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        mintedAt: 'desc',
      },
    });

    return successResponse({ nfts });
  } catch (error) {
    return handleApiError(error);
  }
}
