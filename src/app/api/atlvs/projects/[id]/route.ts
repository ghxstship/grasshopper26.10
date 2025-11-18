import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';

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

    const project = await prisma.project.findUnique({
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
    const project = await prisma.project.update({
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
    const project = await prisma.project.update({
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

    await prisma.project.delete({
      where: { id },
    });

    return successResponse({ message: 'Project deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
