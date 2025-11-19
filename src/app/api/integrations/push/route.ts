import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, validateRequest, requireAuth } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { errors } from '@/lib/api/errors';
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';
import { IntegrationsService } from '@/lib/services/integrations/push.service';


/**
 * Push Notification Integration
 * Sends push notifications via FCM/APNS
 */

const pushNotificationSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(500),
  data: z.record(z.string(), z.unknown()).optional(),
  badge: z.number().int().nonnegative().optional(),
  sound: z.string().optional(),
});

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
    const validated = pushNotificationSchema.parse(body);
    const { userId, title, body: messageBody, data } = validated;

    // Send push notification using service
    const notification = await new IntegrationsService().sendPushNotification(userId, {
      title,
      body: messageBody,
      data,
    });

    return NextResponse.json({
      success: true,
      notification,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
