import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /atlvs/analytics/projects
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

    const projectStats = await prisma.project.groupBy({
      by: ['status'],
      _count: true,
    });

    const recentProjects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        creator: {
          select: { name: true },
        },
      },
    });

    return successResponse({
      stats: projectStats,
      recentProjects,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

