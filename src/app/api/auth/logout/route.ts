import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError,  } from '@/lib/api/response';
import { validateRequest, requireAuth,  } from '@/lib/api/middleware';

// POST /api/auth/logout - Logout user
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Invalidate all active sessions for this user
    await prisma.session.deleteMany({
      where: {
        userId: context.userId!,
      },
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: context.userId!,
        action: 'USER_LOGOUT',
        entity: 'User',
        entityId: context.userId!,
        metadata: {
          timestamp: new Date().toISOString(),
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      },
    });

    return successResponse({
      message: 'Logged out successfully',
      loggedOut: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
