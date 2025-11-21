import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /compvss/operations/contacts
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

    const contacts = await prisma.user.findMany({
      where: {
        role: { in: ['INTERNAL_TEAM', 'EXTERNAL_TEAM'] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      take: 100,
    });

    return successResponse({ contacts });
  } catch (error) {
    return handleApiError(error);
  }
}

