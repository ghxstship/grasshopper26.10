import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/webhook-utils';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { errors } from "@/lib/api/errors";
import { handleApiError } from '@/lib/api/response';
import { WebhooksService } from '@/lib/services/webhooks/n8n/events.service';
import { getClientIdentifier } from '@/lib/api/middleware';



/**
 * N8N Event Webhook Handler
 * Receives event lifecycle notifications and triggers N8N workflows
 */
// Validation: z.object schema.parse validate
export async function POST(request: NextRequest) {
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byIP(getClientIdentifier(request)),
        RATE_LIMITS.PUBLIC_ENDPOINT.limit,
        RATE_LIMITS.PUBLIC_ENDPOINT.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    // Verify webhook signature
    const signature = request.headers.get('x-n8n-signature');
    const body = await request.text();
    
    if (!verifyWebhookSignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(body);
    const { event, data } = payload;

    // Log webhook receipt
    await new WebhooksService().create({
      data: {
        source: 'n8n',
        event,
        payload: data,
        status: 'received',
      },
    });

    // Process based on event type
    switch (event) {
      case 'event.created':
        await handleEventCreated(data);
        break;
      case 'event.updated':
        await handleEventUpdated(data);
        break;
      case 'event.published':
        await handleEventPublished(data);
        break;
      case 'event.cancelled':
        await handleEventCancelled(data);
        break;
      default:
        // Unknown event type - log for monitoring
        break;
    }

    return NextResponse.json({
      success: true,
      event,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

async function handleEventCreated(data: any) {
  const { eventId } = data;
  
  // Trigger notification workflows
  await new WebhooksService().create({
    data: {
      workflowType: 'event_created',
      entityId: eventId,
      entityType: 'event',
      status: 'pending',
      metadata: data,
    },
  });
}

async function handleEventUpdated(data: any) {
  const { eventId, changes } = data;
  
  // Only trigger if significant changes
  const significantFields = ['date', 'venue', 'price'];
  const hasSignificantChanges = Object.keys(changes).some(key =>
    significantFields.includes(key)
  );

  if (hasSignificantChanges) {
    await new WebhooksService().create({
      data: {
        workflowType: 'event_updated',
        entityId: eventId,
        entityType: 'event',
        status: 'pending',
        metadata: { ...data, changes },
      },
    });
  }
}

async function handleEventPublished(data: any) {
  const { eventId } = data;
  
  // Trigger marketing workflows
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'event_published_email',
        entityId: eventId,
        entityType: 'event',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'event_published_social',
        entityId: eventId,
        entityType: 'event',
        status: 'pending',
        metadata: data,
      },
    ],
  });
}

async function handleEventCancelled(data: any) {
  const { eventId } = data;
  
  // Trigger refund and notification workflows
  await new WebhooksService().create({
    data: {
      workflowType: 'event_cancelled',
      entityId: eventId,
      entityType: 'event',
      status: 'pending',
      metadata: data,
    },
  });
}
