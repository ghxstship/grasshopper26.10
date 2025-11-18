import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, createdResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, getPaginationParams, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { createTaskSchema } from '@/lib/validations/tasks';
import type { Prisma } from '@prisma/client';

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
    
    const where: Prisma.DayOfShowTaskWhereInput = {};
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');
    const priority = searchParams.get('priority');
    
    if (status) where.status = status as Prisma.EnumTaskStatusFilter;
    if (assignedTo) where.assignedTo = assignedTo;
    if (priority) where.priority = priority as Prisma.EnumPriorityFilter;

    const [tasks, total] = await Promise.all([
      prisma.dayOfShowTask.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dueTime: 'asc' },
      }),
      prisma.dayOfShowTask.count({ where }),
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
    const validatedData = createTaskSchema.parse(body);
    
    const task = await prisma.dayOfShowTask.create({
      data: validatedData as any,
    });

    return createdResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}
