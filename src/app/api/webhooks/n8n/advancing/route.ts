import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/webhook-utils';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { errors } from '@/lib/api/errors';
import { handleApiError } from '@/lib/api/response';
import { WebhooksService } from '@/lib/services/webhooks/n8n/advancing.service';




/**
 * N8N Advancing Webhook Handler
 * Receives advancing request lifecycle notifications
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
      case 'advancing.submitted':
        await handleAdvancingSubmitted(data);
        break;
      case 'advancing.approved':
        await handleAdvancingApproved(data);
        break;
      case 'advancing.rejected':
        await handleAdvancingRejected(data);
        break;
      case 'advancing.completed':
        await handleAdvancingCompleted(data);
        break;
      default:
        console.warn(`Unknown advancing event: ${event}`);
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

async function handleAdvancingSubmitted(data: any) {
  const { requestId, category: _category, priority: _priority, submitterId: _submitterId } = data;
  
  // Route to appropriate team based on category
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'advancing_routing',
        entityId: requestId,
        entityType: 'advancing',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'advancing_submitter_notification',
        entityId: requestId,
        entityType: 'advancing',
        status: 'pending',
        metadata: data,
      },
    ],
  });
}

async function handleAdvancingApproved(data: any) {
  const { requestId, approverId: _approverId, resources: _resources } = data;
  
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'advancing_approval_notification',
        entityId: requestId,
        entityType: 'advancing',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'advancing_resource_allocation',
        entityId: requestId,
        entityType: 'advancing',
        status: 'pending',
        metadata: data,
      },
    ],
  });
}

async function handleAdvancingRejected(data: any) {
  const { requestId, rejectedBy: _rejectedBy, reason: _reason } = data;
  
  await new WebhooksService().create({
    data: {
      workflowType: 'advancing_rejection_notification',
      entityId: requestId,
      entityType: 'advancing',
      status: 'pending',
      metadata: data,
    },
  });
}

async function handleAdvancingCompleted(data: any) {
  const { requestId, completedBy: _completedBy, results: _results } = data;
  
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'advancing_completion_notification',
        entityId: requestId,
        entityType: 'advancing',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'advancing_analytics',
        entityId: requestId,
        entityType: 'advancing',
        status: 'pending',
        metadata: data,
      },
    ],
  });
}
