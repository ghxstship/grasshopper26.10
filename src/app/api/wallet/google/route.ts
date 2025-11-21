import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /wallet/google
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.PUBLIC_ENDPOINT.limit,
      RATE_LIMITS.PUBLIC_ENDPOINT.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      throw errors.badRequest('ticketId is required');
    }

    // Get ticket with event details
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        event: {
          include: {
            venue: true,
          },
        },
      },
    });

    if (!ticket) {
      throw errors.notFound('Ticket not found');
    }

    if (ticket.userId !== context.userId) {
      throw errors.forbidden('Not authorized to access this ticket');
    }

    // Generate Google Wallet pass URL
    const passData = {
      ticketId: ticket.id,
      eventName: ticket.event.name,
      eventDate: ticket.event.startDate,
      venue: ticket.event.venue?.name || 'TBA',
      qrCode: ticket.qrCode,
    };

    return successResponse({
      passUrl: `https://pay.google.com/gp/v/save/${Buffer.from(JSON.stringify(passData)).toString('base64')}`,
      ticket: passData,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

