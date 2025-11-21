import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /compvss/operations/hub
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

    const checkInCount = await prisma.checkIn.count();
    const issueCount = await prisma.issueReport.count({ where: { status: 'OPEN' } });
    const advancingCount = await prisma.advancingRequest.count({ where: { status: 'PENDING' } });

    return successResponse({
      overview: {
        checkIns: checkInCount,
        openIssues: issueCount,
        pendingRequests: advancingCount,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

