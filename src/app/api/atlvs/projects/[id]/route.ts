import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { AtlvsService } from '@/lib/services/atlvs/projects/id.service';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.READ_OPERATIONS.limit,
      RATE_LIMITS.READ_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const project = await new AtlvsService().findById({
      where: { id: id },
      include: {
        organization: true,
        creator: { select: { id: true, name: true } },
        phases: true,
        milestones: true,
        tasks: { take: 10, orderBy: { createdAt: 'desc' } },
        budgets: true,
      },
    });

    if (!project) {
      throw errors.notFound('Project not found');
    }

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.WRITE_OPERATIONS.limit,
      RATE_LIMITS.WRITE_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.json();
    const project = await new AtlvsService().update({
      where: { id },
      data: body,
      include: {
        organization: true,
        creator: { select: { id: true, name: true } },
      },
    });

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.WRITE_OPERATIONS.limit,
      RATE_LIMITS.WRITE_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.json();
    const project = await new AtlvsService().update({
      where: { id },
      data: body,
      include: {
        organization: true,
        creator: { select: { id: true, name: true } },
      },
    });

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    await new AtlvsService().delete({
      where: { id },
    });

    return successResponse({ message: 'Project deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
