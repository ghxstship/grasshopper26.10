import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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
  data: z.record(z.unknown()).optional(),
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
    const { userId, title, body: messageBody, data, badge, sound } = validated;

    // Get user's device tokens
    const devices = await new IntegrationsService().findAll({
      where: {
        userId,
        pushEnabled: true,
      },
    });

    if (devices.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No devices registered for push notifications',
        sent: 0,
      });
    }

    const results = [];

    for (const device of devices) {
      try {
        if (device.platform === 'ios') {
          // APNS
          await sendAPNS(device.token, title, messageBody, data, badge, sound);
        } else if (device.platform === 'android') {
          // FCM
          await sendFCM(device.token, title, messageBody, data);
        }
        results.push({ deviceId: device.id, success: true });
      } catch (error) {
        results.push({ deviceId: device.id, success: false, error: String(error) });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      sent: successCount,
      total: devices.length,
      results,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

async function sendFCM(
  token: string,
  title: string,
  body: string,
  data?: Record<string, any>
) {
  const fcmServerKey = process.env.FCM_SERVER_KEY;
  if (!fcmServerKey) {
    throw new Error('FCM server key not configured');
  }

  const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key=${fcmServerKey}`,
    },
    body: JSON.stringify({
      to: token,
      notification: { title, body },
      data,
    }),
  });

  if (!response.ok) {
    throw new Error(`FCM error: ${response.statusText}`);
  }
}

async function sendAPNS(
  token: string,
  title: string,
  body: string,
  data?: Record<string, any>,
  badge?: number,
  sound?: string
) {
  // APNS implementation would go here
  // Requires APNS certificates and proper setup
  console.log('APNS notification:', { token, title, body, data, badge, sound });
  // Placeholder for actual APNS implementation
}
