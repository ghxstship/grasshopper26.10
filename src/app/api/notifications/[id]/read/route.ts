import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// PATCH /api/notifications/[id]/read - Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    // Check if notification exists and belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id: id },
    });

    if (!notification) {
      throw errors.notFound('Notification');
    }

    if (notification.userId !== context.userId) {
      throw errors.forbidden();
    }

    // Mark as read
    const updatedNotification = await prisma.notification.update({
      where: { id: id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return successResponse(updatedNotification);
  } catch (error) {
    return handleApiError(error);
  }
}
