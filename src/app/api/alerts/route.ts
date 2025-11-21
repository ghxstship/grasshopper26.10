import { NextRequest } from 'next/server';
import { successResponse, createdResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { createAlertSchema } from '@/lib/validations/alerts';
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { prisma } from '@/lib/prisma';



export async function GET(request: NextRequest) {
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

    const alerts = await prisma.alert.findMany({
      where: {
        userId: context.userId,
        active: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(alerts);
  } catch (error) {
    return handleApiError(error);
  }
}

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

    const body = await request.json();
    const validatedData = createAlertSchema.parse(body);
    
    const alert = await prisma.alert.create({
      data: {
        ...validatedData,
        userId: context.userId,
      } as any,
    });

    return createdResponse(alert);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('id');

    if (!alertId) {
      throw errors.badRequest('Alert ID required');
    }

    // Verify the alert exists and belongs to the user
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
    });

    if (!alert) {
      throw errors.notFound('Alert');
    }

    if (alert.userId !== context.userId) {
      throw errors.forbidden('You do not have permission to delete this alert');
    }

    await prisma.alert.delete({
      where: { id: alertId },
    });

    return successResponse({ message: 'Alert deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
