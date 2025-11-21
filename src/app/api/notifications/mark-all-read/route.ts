import { NextRequest } from 'next/server';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { NotificationsService } from '@/lib/services/notifications/markAllRead.service';
import { errors } from '@/lib/api/errors';



// POST /api/notifications/mark-all-read - Mark all notifications as read
export async function POST(request: NextRequest) {
  try {const context = await validateRequest(request);
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

    // Mark all unread notifications as read
    const result = await new NotificationsService().updateMany({
      where: {
        userId: context.userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return successResponse({
      message: 'All notifications marked as read',
      count: result.count,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
