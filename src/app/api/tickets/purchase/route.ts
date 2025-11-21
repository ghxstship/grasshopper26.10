import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { createdResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RateLimitIdentifiers, RATE_LIMITS } from '@/lib/api/rate-limits';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const purchaseTicketsSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  ticketType: z.string().min(1, 'Ticket type is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
});

// POST /api/tickets/purchase - Purchase tickets for an event
export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.json();
    const data = purchaseTicketsSchema.parse(body);

    // Verify event exists and is active
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
      include: {
        ticketTypes: {
          where: { name: data.ticketType },
        },
      },
    });

    if (!event) {
      throw errors.notFound('Event not found');
    }

    if (event.status !== 'PUBLISHED') {
      throw errors.badRequest('Event is not available for ticket purchase');
    }

    const ticketType = event.ticketTypes[0];
    if (!ticketType) {
      throw errors.notFound('Ticket type not found');
    }

    // Check availability
    const available = ticketType.quantity - ticketType.sold;
    if (available < data.quantity) {
      throw errors.badRequest('Not enough tickets available');
    }

    // Calculate total (Prisma Decimal to number conversion)
    const pricePerTicket = Number(ticketType.price);
    const subtotal = new Prisma.Decimal(pricePerTicket * data.quantity);
    const tax = new Prisma.Decimal(subtotal.toNumber() * 0.08); // 8% tax
    const fees = new Prisma.Decimal(data.quantity * 2.5); // $2.50 per ticket fee
    const total = new Prisma.Decimal(
      subtotal.toNumber() + tax.toNumber() + fees.toNumber()
    );

    // Create order and tickets in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          userId: context.userId,
          eventId: data.eventId,
          status: 'COMPLETED',
          subtotal,
          tax,
          fees,
          total,
          currency: ticketType.currency || 'USD',
          paymentMethod: data.paymentMethodId,
          orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        },
      });

      // Create tickets
      const tickets = await Promise.all(
        Array.from({ length: data.quantity }).map(async () => {
          const ticketCode = `TKT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
          return tx.ticket.create({
            data: {
              userId: context.userId,
              eventId: data.eventId,
              ticketTypeId: ticketType.id,
              orderId: order.id,
              status: 'VALID',
              qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${ticketCode}`,
            },
          });
        })
      );

      // Update ticket sales count
      await tx.ticketType.update({
        where: { id: ticketType.id },
        data: {
          sold: {
            increment: data.quantity,
          },
        },
      });

      return { order, tickets };
    });

    return createdResponse({
      orderId: result.order.id,
      tickets: result.tickets.map((t) => ({
        id: t.id,
        type: data.ticketType,
        qrCode: t.qrCode,
      })),
      total: total.toNumber(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
