import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/webhook-utils';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { errors } from "@/lib/api/errors";
import { handleApiError } from '@/lib/api/response';
import { WebhooksService } from '@/lib/services/webhooks/n8n/tasks.service';




/**
 * N8N Task Webhook Handler
 * Receives task status change notifications
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
      case 'task.created':
        await handleTaskCreated(data);
        break;
      case 'task.assigned':
        await handleTaskAssigned(data);
        break;
      case 'task.completed':
        await handleTaskCompleted(data);
        break;
      case 'task.overdue':
        await handleTaskOverdue(data);
        break;
      default:
        console.warn(`Unknown task event: ${event}`);
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

async function handleTaskCreated(data: any) {
  const { taskId, projectId, createdBy } = data;
  
  await new WebhooksService().create({
    data: {
      workflowType: 'task_created_notification',
      entityId: taskId,
      entityType: 'task',
      status: 'pending',
      metadata: data,
    },
  });
}

async function handleTaskAssigned(data: any) {
  const { taskId, assigneeId, assignedBy, dueDate } = data;
  
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'task_assignment_notification',
        entityId: taskId,
        entityType: 'task',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'task_reminder_schedule',
        entityId: taskId,
        entityType: 'task',
        status: 'pending',
        metadata: data,
        scheduledFor: new Date(new Date(dueDate).getTime() - 24 * 60 * 60 * 1000), // 1 day before
      },
    ],
  });
}

async function handleTaskCompleted(data: any) {
  const { taskId, completedBy, projectId } = data;
  
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'task_completion_notification',
        entityId: taskId,
        entityType: 'task',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'task_analytics',
        entityId: taskId,
        entityType: 'task',
        status: 'pending',
        metadata: data,
      },
    ],
  });
}

async function handleTaskOverdue(data: any) {
  const { taskId, assigneeId, daysOverdue } = data;
  
  await new WebhooksService().create({
    data: {
      workflowType: 'task_overdue_escalation',
      entityId: taskId,
      entityType: 'task',
      status: 'pending',
      metadata: data,
    },
  });
}
