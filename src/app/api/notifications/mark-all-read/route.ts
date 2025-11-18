import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError,  } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

// POST /api/notifications/mark-all-read - Mark all notifications as read
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Mark all unread notifications as read
    const result = await prisma.notification.updateMany({
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
