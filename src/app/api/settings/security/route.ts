import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /settings/security
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

    const sessions = await prisma.session.findMany({
      where: { userId: context.userId },
      orderBy: { expires: 'desc' },
      take: 10,
    });

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: context.userId },
      select: {
        id: true,
        name: true,
        lastUsed: true,
        createdAt: true,
      },
    });

    return successResponse({
      sessions,
      apiKeys,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

