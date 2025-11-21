import { NextRequest } from 'next/server';
import { successResponse, createdResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, parseBody, parseQuery, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { createAdvancingRequestSchema, queryAdvancingRequestsSchema } from '@/lib/validations/advancing';
import { CompvssService } from '@/lib/services/compvss/advancing.service';
import { prisma } from '@/lib/prisma';


// GET /api/compvss/advancing - List advancing requests
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.READ_OPERATIONS.limit,
      RATE_LIMITS.READ_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const query = parseQuery(request, queryAdvancingRequestsSchema);
    const { page, limit, sortBy, sortOrder, ...filters } = query;

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filters.eventId) where.eventId = filters.eventId;
    if (filters.category) where.category = filters.category;
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.requestedBy) where.requestedById = filters.requestedBy;
    if (filters.assignedTo) where.assignedToId = filters.assignedTo;

    const [requests, total] = await Promise.all([
      prisma.advancingRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          event: {
            select: {
              id: true,
              name: true,
              startDate: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.advancingRequest.count({ where }),
    ]);

    return successResponse({
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/compvss/advancing - Create advancing request
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.WRITE_OPERATIONS.limit,
      RATE_LIMITS.WRITE_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const body = await parseBody(request);
    const validatedData = createAdvancingRequestSchema.parse(body);

    const advancingRequest = await new CompvssService().create({
      data: {
        userId: validatedData.requestedBy,
        eventId: validatedData.eventId,
        category: validatedData.category,
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        status: 'PENDING',
      },
      include: {
        event: true,
        user: true,
      },
    });

    return createdResponse(advancingRequest);
  } catch (error) {
    return handleApiError(error);
  }
}
