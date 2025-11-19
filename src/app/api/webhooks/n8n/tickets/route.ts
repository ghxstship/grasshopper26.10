import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/webhook-utils';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { errors } from "@/lib/api/errors";
import { handleApiError } from '@/lib/api/response';
import { WebhooksService } from '@/lib/services/webhooks/n8n/tickets.service';




/**
 * N8N Ticket Webhook Handler
 * Receives ticket purchase and transfer notifications
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
      case 'ticket.purchased':
        await handleTicketPurchased(data);
        break;
      case 'ticket.transferred':
        await handleTicketTransferred(data);
        break;
      case 'ticket.scanned':
        await handleTicketScanned(data);
        break;
      case 'ticket.refunded':
        await handleTicketRefunded(data);
        break;
      default:
        console.warn(`Unknown ticket event: ${event}`);
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

async function handleTicketPurchased(data: any) {
  const { ticketId, orderId, userId, eventId } = data;
  
  // Trigger confirmation workflows
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'ticket_confirmation_email',
        entityId: ticketId,
        entityType: 'ticket',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'ticket_qr_generation',
        entityId: ticketId,
        entityType: 'ticket',
        status: 'pending',
        metadata: data,
      },
      {
        workflowType: 'ticket_wallet_pass',
        entityId: ticketId,
        entityType: 'ticket',
        status: 'pending',
        metadata: data,
      },
    ],
  });
}

async function handleTicketTransferred(data: any) {
  const { ticketId, fromUserId, toUserId } = data;
  
  await new WebhooksService().createMany({
    data: [
      {
        workflowType: 'ticket_transfer_notification',
        entityId: ticketId,
        entityType: 'ticket',
        status: 'pending',
        metadata: { ...data, recipient: 'sender' },
      },
      {
        workflowType: 'ticket_transfer_notification',
        entityId: ticketId,
        entityType: 'ticket',
        status: 'pending',
        metadata: { ...data, recipient: 'receiver' },
      },
    ],
  });
}

async function handleTicketScanned(data: any) {
  const { ticketId, scannedAt, location } = data;
  
  // Update ticket status and trigger analytics
  await new WebhooksService().create({
    data: {
      workflowType: 'ticket_scanned_analytics',
      entityId: ticketId,
      entityType: 'ticket',
      status: 'pending',
      metadata: data,
    },
  });
}

async function handleTicketRefunded(data: any) {
  const { ticketId, refundAmount, reason } = data;
  
  await new WebhooksService().create({
    data: {
      workflowType: 'ticket_refund_notification',
      entityId: ticketId,
      entityType: 'ticket',
      status: 'pending',
      metadata: data,
    },
  });
}
