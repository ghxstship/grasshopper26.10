import { NextRequest } from 'next/server';
import { successResponse, createdResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, getPaginationParams, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { Prisma, TaskStatus } from '@prisma/client';
import { AtlvsService } from '@/lib/services/atlvs/tasks.service';
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    
    const where: Prisma.TaskWhereInput = {};
    const status = searchParams.get('status');
    const assigneeId = searchParams.get('assigneeId');
    const projectId = searchParams.get('projectId');
    
    if (status && Object.values(TaskStatus).includes(status as TaskStatus)) {
      where.status = status as TaskStatus;
    }
    if (assigneeId) where.assigneeId = assigneeId;
    if (projectId) where.projectId = projectId;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          project: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true } },
          creator: { select: { id: true, name: true } },
        },
      }),
      prisma.task.count({ where }),
    ]);

    return successResponse(tasks, {
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

    const body = await request.json();
    const task = await new AtlvsService().create({
      data: {
        ...body,
        createdBy: context.userId,
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });

    return createdResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}
