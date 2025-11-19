import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notificationFiltersSchema } from '@/lib/validations/notifications';
import { successResponse, handleApiError,  } from '@/lib/api/response';
import { getPaginationParams, validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { NotificationsService } from '@/lib/services/notifications.service';



// GET /api/notifications - List user notifications
export async function GET(request: NextRequest) {
  try {
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

    const context = await validateRequest(request);
    requireAuth(context);

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);

    // Parse filters
    const filters = notificationFiltersSchema.parse(Object.fromEntries(searchParams));

    // Build where clause
    const where: Record<string, unknown> = {
      userId: context.userId,
    };

    if (filters.type) where.type = filters.type;
    if (filters.priority) where.priority = filters.priority;
    if (filters.read !== undefined) where.read = filters.read;

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        (where.createdAt as Record<string, unknown>).gte = filters.startDate;
      }
      if (filters.endDate) {
        (where.createdAt as Record<string, unknown>).lte = filters.endDate;
      }
    }

    // Get total count
    const total = await prisma.notification.count({ where });
    const unreadCount = await prisma.notification.count({
      where: {
        userId: context.userId,
        read: false,
      },
    });

    // Get notifications
    const notifications = await new NotificationsService().findAll({
      where,
      skip,
      take: limit,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return successResponse(
      {
        notifications,
        unreadCount,
      },
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
