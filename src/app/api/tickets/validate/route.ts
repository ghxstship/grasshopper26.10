import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateTicketSchema } from '@/lib/validations/orders';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth } from '@/lib/api/middleware';

// POST /api/tickets/validate - Validate ticket (QR scan)
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = validateTicketSchema.parse(body);

    // Find ticket by QR code
    const ticket = await prisma.ticket.findUnique({
      where: { qrCode: validatedData.qrCode },
      include: {
        event: {
          select: {
            id: true,
            name: true,
            status: true,
            startDate: true,
            endDate: true,
          },
        },
        ticketType: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      throw errors.notFound('Ticket');
    }

    // Check ticket status
    if (ticket.status === 'USED') {
      return successResponse({
        valid: false,
        reason: 'ALREADY_USED',
        message: 'This ticket has already been used',
        ticket: {
          id: ticket.id,
          event: ticket.event,
        },
      });
    }

    if (ticket.status === 'CANCELLED') {
      return successResponse({
        valid: false,
        reason: 'CANCELLED',
        message: 'This ticket has been cancelled',
        ticket,
      });
    }

    if (ticket.status === 'REFUNDED') {
      return successResponse({
        valid: false,
        reason: 'REFUNDED',
        message: 'This ticket has been refunded',
      });
    }

    if (ticket.status === 'TRANSFERRED') {
      return successResponse({
        valid: false,
        reason: 'TRANSFERRED',
        message: 'This ticket has been transferred to another user',
      });
    }

    // Check event status
    if (ticket.event.status === 'CANCELLED') {
      return successResponse({
        valid: false,
        reason: 'EVENT_CANCELLED',
        message: 'The event has been cancelled',
      });
    }

    // Mark ticket as used
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: 'USED',
        metadata: JSON.parse(JSON.stringify({
          ...(ticket.metadata as Record<string, unknown> || {}),
          validatedBy: context.userId,
          validatedAt: new Date().toISOString(),
          location: validatedData.location,
          ...(validatedData.metadata || {}),
        })),
      },
    });

    return successResponse({
      valid: true,
      message: 'Ticket validated successfully',
      ticket: {
        id: updatedTicket.id,
        event: ticket.event,
        ticketType: ticket.ticketType,
        user: ticket.user,
        seatNumber: ticket.seatNumber,
        status: updatedTicket.status,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
