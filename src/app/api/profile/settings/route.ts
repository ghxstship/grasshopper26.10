import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { z } from 'zod';
import { ProfileService } from '@/lib/services/profile/settings.service';
import { errors } from '@/lib/api/errors';



export async function GET(request: NextRequest) {
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

    const preferences = await new ProfileService().findById({
      where: { userId: context.userId },
    });

    return successResponse(preferences || {
      email: true,
      push: true,
      inApp: true,
      statusChanges: true,
      comments: true,
      assignments: true,
      dueDateReminders: true,
      socialNotifications: true,
      orderUpdates: true,
      ticketUpdates: true,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();

    const preferences = await prisma.notificationPreferences.upsert({
      where: { userId: context.userId },
      create: {
        userId: context.userId,
        ...body,
      },
      update: body,
    });

    return successResponse(preferences);
  } catch (error) {
    return handleApiError(error);
  }
}
