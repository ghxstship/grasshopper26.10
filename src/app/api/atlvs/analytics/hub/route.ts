import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /atlvs/analytics/hub
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

    const projectCount = await prisma.project.count();
    const taskCount = await prisma.task.count();
    const budgetCount = await prisma.budget.count();
    const advancingCount = await prisma.advancingRequest.count();

    return successResponse({
      overview: {
        projects: projectCount,
        tasks: taskCount,
        budgets: budgetCount,
        advancingRequests: advancingCount,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

