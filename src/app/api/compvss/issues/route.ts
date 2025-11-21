import { NextRequest } from 'next/server';
import { successResponse, createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth, getPaginationParams } from '@/lib/api/middleware';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { CompvssService } from '@/lib/services/compvss/issues.service';
import { errors } from '@/lib/api/errors';
import { prisma } from '@/lib/prisma';



export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    
    const where: Record<string, unknown> = {};
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [issues, total] = await Promise.all([
      prisma.issueReport.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.issueReport.count({ where }),
    ]);

    return successResponse(issues, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.json();
    const issue = await new CompvssService().create({
      data: {
        ...body,
        userId: context.userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return createdResponse(issue);
  } catch (error) {
    return handleApiError(error);
  }
}
