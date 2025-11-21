import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/webhook-utils';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { errors } from '@/lib/api/errors';
import { handleApiError } from '@/lib/api/response';
import { WebhooksService } from '@/lib/services/webhooks/n8n/projects.service';




/**
 * N8N Project Webhook Handler
 * Receives project lifecycle notifications
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
      case 'project.created':
        await handleProjectCreated(data);
        break;
      case 'project.updated':
        await handleProjectUpdated(data);
        break;
      case 'project.milestone_reached':
        await handleMilestoneReached(data);
        break;
      case 'project.completed':
        await handleProjectCompleted(data);
        break;
      default:
        console.warn(`Unknown project event: ${event}`);
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

async function handleProjectCreated(data: any) {
  const { projectId, projectName: _projectName, leadId: _leadId, teamMembers: _teamMembers } = data;
  
  // Trigger project setup workflows
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'project_setup_tasks',
        entityId: projectId,
        entityType: 'project',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'project_team_notification',
        entityId: projectId,
        entityType: 'project',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'project_budget_initialization',
        entityId: projectId,
        entityType: 'project',
        status: 'pending',
        metadata: data,
      },
    ],
  });
}

async function handleProjectUpdated(data: any) {
  const { projectId, changes } = data;
  
  // Check for significant changes
  const significantFields = ['status', 'deadline', 'budget'];
  const hasSignificantChanges = Object.keys(changes).some(key =>
    significantFields.includes(key)
  );

  if (hasSignificantChanges) {
    await new WebhooksService().create({
      data: {
        workflowType: 'project_update_notification',
        entityId: projectId,
        entityType: 'project',
        status: 'pending',
        metadata: { ...data, changes },
      },
    });
  }
}

async function handleMilestoneReached(data: any) {
  const { projectId, milestone: _milestone, completionPercentage: _completionPercentage } = data;
  
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'milestone_celebration',
        entityId: projectId,
        entityType: 'project',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'milestone_analytics',
        entityId: projectId,
        entityType: 'project',
        status: 'pending',
        metadata: data,
      },
    ],
  });
}

async function handleProjectCompleted(data: any) {
  const { projectId, completedBy: _completedBy, finalBudget: _finalBudget, duration: _duration } = data;
  
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'project_completion_notification',
        entityId: projectId,
        entityType: 'project',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'project_retrospective',
        entityId: projectId,
        entityType: 'project',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'project_archive',
        entityId: projectId,
        entityType: 'project',
        status: 'pending',
        metadata: data,
      },
    ],
  });
}
