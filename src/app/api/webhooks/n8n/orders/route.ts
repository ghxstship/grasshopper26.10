import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/webhook-utils';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { errors } from '@/lib/api/errors';
import { handleApiError } from '@/lib/api/response';
import { WebhooksService } from '@/lib/services/webhooks/n8n/orders.service';




/**
 * N8N Order Webhook Handler
 * Receives order lifecycle notifications
 */
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

    await new WebhooksService().create({
      data: {
        source: 'n8n',
        event,
        payload: data,
        status: 'received',
      },
    });

    switch (event) {
      case 'order.created':
        await handleOrderCreated(data);
        break;
      case 'order.completed':
        await handleOrderCompleted(data);
        break;
      case 'order.failed':
        await handleOrderFailed(data);
        break;
      case 'order.refunded':
        await handleOrderRefunded(data);
        break;
      default:
        console.warn(`Unknown order event: ${event}`);
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

async function handleOrderCreated(data: any) {
  const { orderId, userId: _userId } = data;
  
  // Start abandoned cart timer
  await new WebhooksService().create({
    data: {
      workflowType: 'order_created',
      entityId: orderId,
      entityType: 'order',
      status: 'pending',
      metadata: data,
      scheduledFor: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    },
  });
}

async function handleOrderCompleted(data: any) {
  const { orderId, userId: _userId, items: _items, total: _total } = data;
  
  // Trigger fulfillment workflows
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'order_confirmation',
        entityId: orderId,
        entityType: 'order',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'order_fulfillment',
        entityId: orderId,
        entityType: 'order',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'order_analytics',
        entityId: orderId,
        entityType: 'order',
        status: 'pending',
        metadata: data,
      },
    ],
  });

  // Cancel abandoned cart workflow if exists
  await new WebhooksService().updateMany({
    where: {
      entityId: orderId,
      workflowType: 'order_created',
      status: 'pending',
    },
    data: {
      status: 'cancelled',
    },
  });
}

async function handleOrderFailed(data: any) {
  const { orderId, userId: _userId, errorCode: _errorCode, errorMessage: _errorMessage } = data;
  
  await new WebhooksService().create({
    data: {
      workflowType: 'order_failed_notification',
      entityId: orderId,
      entityType: 'order',
      status: 'pending',
      metadata: data,
    },
  });
}

async function handleOrderRefunded(data: any) {
  const { orderId, refundAmount: _refundAmount, reason: _reason } = data;
  
  await new WebhooksService().create({
    data: {
      workflowType: 'order_refund_notification',
      entityId: orderId,
      entityType: 'order',
      status: 'pending',
      metadata: data,
    },
  });
}
