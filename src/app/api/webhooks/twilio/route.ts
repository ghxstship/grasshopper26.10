/**
 * Twilio webhook handler
 * Handles SMS status callbacks
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { handleApiError } from '@/lib/api/response';
import { WebhooksService } from '@/lib/services/webhooks/twilio.service';




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

    const formData = await request.formData();
    
    const messageSid = formData.get('MessageSid') as string;
    const messageStatus = formData.get('MessageStatus') as string;
    const to = formData.get('To') as string;
    const from = formData.get('From') as string;
    const errorCode = formData.get('ErrorCode') as string | null;

    console.log('Twilio webhook:', {
      messageSid,
      messageStatus,
      to,
      from,
      errorCode,
    });

    switch (messageStatus) {
      case 'delivered':
        await handleSMSDelivered(messageSid, to);
        break;

      case 'failed':
        await handleSMSFailed(messageSid, to, errorCode);
        break;

      case 'undelivered':
        await handleSMSUndelivered(messageSid, to, errorCode);
        break;

      default:
        console.log(`SMS status: ${messageStatus}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}

async function handleSMSDelivered(messageSid: string, to: string) {
  console.log('SMS delivered:', messageSid, to);
  
  const { prisma } = await import('@/lib/prisma');
  await new WebhooksService().create({
    data: {
      action: 'SMS_DELIVERED',
      entity: 'SMS',
      metadata: {
        messageSid,
        to,
        timestamp: new Date().toISOString(),
      },
    },
  }).catch(err => console.error('Failed to log SMS delivery:', err));
}

async function handleSMSFailed(messageSid: string, to: string, errorCode: string | null) {
  console.log('SMS failed:', messageSid, to, errorCode);
  
  const { prisma } = await import('@/lib/prisma');
  await new WebhooksService().create({
    data: {
      action: 'SMS_FAILED',
      entity: 'SMS',
      metadata: {
        messageSid,
        to,
        errorCode,
        timestamp: new Date().toISOString(),
      },
    },
  }).catch(err => console.error('Failed to log SMS failure:', err));
  
  // Notify admin of SMS failure
  if (errorCode && ['30003', '30005', '30006'].includes(errorCode)) {
    console.error('Critical SMS error - admin notification required:', { messageSid, to, errorCode });
  }
}

async function handleSMSUndelivered(messageSid: string, to: string, errorCode: string | null) {
  console.log('SMS undelivered:', messageSid, to, errorCode);
  
  const { prisma } = await import('@/lib/prisma');
  await new WebhooksService().create({
    data: {
      action: 'SMS_UNDELIVERED',
      entity: 'SMS',
      metadata: {
        messageSid,
        to,
        errorCode,
        invalidNumber: true,
        timestamp: new Date().toISOString(),
      },
    },
  }).catch(err => console.error('Failed to log SMS undelivered:', err));
}
