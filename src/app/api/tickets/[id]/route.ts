import { NextRequest } from 'next/server';
import { transferTicketSchema } from '@/lib/validations/orders';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { TicketsService } from '@/lib/services/tickets/id.service';
import { prisma } from '@/lib/prisma';


type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/tickets/[id] - Get ticket by ID
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.READ_OPERATIONS.limit,
      RATE_LIMITS.READ_OPERATIONS.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const ticket = await new TicketsService().findById({
      where: { id: id },
      include: {
        ticketType: {
          select: {
            name: true,
            description: true,
            price: true,
            currency: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            startDate: true,
            endDate: true,
            venue: {
              select: {
                name: true,
                address: true,
                city: true,
                state: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
          },
        },
      },
    });

    if (!ticket) {
      throw errors.notFound('Ticket');
    }

    // Check if user owns this ticket
    if (ticket.userId !== context.userId && context.userRole !== 'ADMIN') {
      throw errors.forbidden();
    }

    return successResponse(ticket);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/tickets/[id]/transfer - Transfer ticket to another user
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = transferTicketSchema.parse(body);

    // Get ticket
    const { id } = await params;
    const ticket = await new TicketsService().findById({
      where: { id: id },
      include: {
        event: true,
      },
    });

    if (!ticket) {
      throw errors.notFound('Ticket');
    }

    // Check ownership
    if (ticket.userId !== context.userId) {
      throw errors.forbidden();
    }

    // Check if ticket can be transferred
    if (ticket.status !== 'VALID') {
      throw errors.badRequest('Only valid tickets can be transferred');
    }

    // Get event details
    const event = await prisma.event.findUnique({
      where: { id: ticket.eventId },
      select: { startDate: true },
    });

    // Check if event hasn't started
    if (event && event.startDate < new Date()) {
      throw errors.badRequest('Cannot transfer tickets for events that have already started');
    }

    // Find recipient user
    const recipient = await prisma.user.findUnique({
      where: { email: validatedData.recipientEmail },
    });

    if (!recipient) {
      throw errors.notFound('Recipient user');
    }

    // Update ticket status
    await new TicketsService().update({
      where: { id: id },
      data: {
        status: 'TRANSFERRED',
        transferredAt: new Date(),
      } as any,
    });

    // Create new ticket for recipient
    const existingMetadata = ticket.metadata as Record<string, unknown> | null;
    const newTicket = await new TicketsService().create({
      data: {
        userId: recipient.id,
        eventId: ticket.eventId,
        ticketTypeId: ticket.ticketTypeId,
        orderId: ticket.orderId,
        qrCode: `${ticket.qrCode}-TRANSFER-${Date.now()}`,
        status: 'VALID',
        seatNumber: ticket.seatNumber,
        metadata: {
          ...(existingMetadata || {}),
          transferredFrom: context.userId,
          transferMessage: validatedData.message,
        },
      },
    });

    // Send notification to recipient
    const sender = await prisma.user.findUnique({
      where: { id: context.userId! },
      select: { name: true },
    });

    if (recipient) {
      await prisma.notification.create({
        data: {
          userId: recipient.id,
          type: 'TICKET_TRANSFER',
          title: 'Ticket Transferred to You',
          message: `${sender?.name || 'Someone'} transferred a ticket to you${validatedData.message ? `: ${validatedData.message}` : ''}`,
          metadata: {
            ticketId: newTicket.id,
            originalTicketId: id,
            senderId: context.userId!,
            senderName: sender?.name,
            eventId: ticket.eventId,
            message: validatedData.message,
          },
        },
      });
    }

    return successResponse({
      message: 'Ticket transferred successfully',
      newTicket,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
