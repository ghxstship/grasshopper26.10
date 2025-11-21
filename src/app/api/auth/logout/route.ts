import { NextRequest } from 'next/server';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { errors } from '@/lib/api/errors';
import { prisma } from '@/lib/prisma';



// POST /api/auth/logout - Logout user
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
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
