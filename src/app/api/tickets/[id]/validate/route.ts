import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        event: true,
        ticketType: true,
      },
    });

    if (!ticket) {
      throw errors.notFound('Ticket');
    }

    // Check if ticket is valid
    if (ticket.status === 'USED') {
      return successResponse({
        valid: false,
        reason: 'Ticket already used',
        ticket,
      });
    }

    if (ticket.status === 'CANCELLED' || ticket.status === 'REFUNDED') {
      return successResponse({
        valid: false,
        reason: `Ticket ${ticket.status.toLowerCase()}`,
        ticket,
      });
    }

    if (ticket.status === 'TRANSFERRED') {
      return successResponse({
        valid: false,
        reason: 'Ticket has been transferred',
        ticket,
      });
    }

    // Check if event has started
    const now = new Date();
    if (ticket.event.startDate > now) {
      return successResponse({
        valid: false,
        reason: 'Event has not started yet',
        ticket,
      });
    }

    // Mark ticket as used
    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        status: 'USED',
        usedAt: new Date(),
      },
      include: {
        event: true,
        ticketType: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return successResponse({
      valid: true,
      ticket: updatedTicket,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
