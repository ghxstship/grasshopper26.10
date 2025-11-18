/**
 * GVTEWAY Ticket Service
 * Handles all ticket operations for the ticketing platform
 */

import { prisma } from '@/lib/prisma';
import { TicketStatus, Prisma } from '@prisma/client';
import { AuditService } from '../shared/audit.service';
import { NotificationService } from '../shared/NotificationService';
import { PermissionService } from '../shared/permission.service';
import { getStripeClient } from '@/lib/integrations/stripe';

const notificationService = new NotificationService();

export class TicketService {
  /**
   * Get all tickets with filtering
   */
  static async getAll(params: {
    eventId?: string;
    userId?: string;
    status?: TicketStatus;
    ticketTypeId?: string;
    page?: number;
    limit?: number;
  }) {
    const { eventId, userId, status, ticketTypeId, page = 1, limit = 20 } = params;

    const where: Prisma.TicketWhereInput = {
      ...(eventId && { eventId }),
      ...(userId && { userId }),
      ...(status && { status }),
      ...(ticketTypeId && { ticketTypeId }),
    };

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          event: {
            select: {
              id: true,
              name: true,
              startDate: true,
              venue: {
                select: {
                  name: true,
                  city: true,
                  state: true,
                },
              },
            },
          },
          ticketType: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single ticket by ID
   */
  static async getById(id: string) {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        event: {
          include: {
            venue: true,
          },
        },
        ticketType: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return ticket;
  }

  /**
   * Get ticket by QR code
   */
  static async getByQRCode(qrCode: string) {
    const ticket = await prisma.ticket.findFirst({
      where: { qrCode },
      include: {
        event: {
          include: {
            venue: true,
          },
        },
        ticketType: true,
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
      throw new Error('Ticket not found');
    }

    return ticket;
  }

  /**
   * Create tickets for an order
   */
  static async createForOrder(params: {
    orderId: string;
    eventId: string;
    userId: string;
    tickets: Array<{
      ticketTypeId: string;
      seatNumber?: string;
    }>;
  }) {
    const { orderId, eventId, userId, tickets: ticketData } = params;

    const createdTickets = await Promise.all(
      ticketData.map(async (ticket) => {
        const qrCode = await this.generateQRCode();

        return prisma.ticket.create({
          data: {
            eventId,
            userId,
            orderId,
            ticketTypeId: ticket.ticketTypeId,
            seatNumber: ticket.seatNumber,
            qrCode,
            status: TicketStatus.VALID,
          },
          include: {
            ticketType: true,
          },
        });
      })
    );

    await AuditService.log({
      userId,
      action: 'CREATE',
      entity: 'Ticket',
      entityId: orderId,
      metadata: { count: createdTickets.length, eventId },
    });

    return createdTickets;
  }

  /**
   * Transfer ticket to another user
   */
  static async transfer(params: {
    ticketId: string;
    fromUserId: string;
    toUserEmail: string;
  }) {
    const { ticketId, fromUserId, toUserEmail } = params;

    const ticket = await this.getById(ticketId);

    // Verify ownership
    if (ticket.userId !== fromUserId) {
      throw new Error('You do not own this ticket');
    }

    // Verify ticket is transferable
    if (ticket.status !== TicketStatus.VALID) {
      throw new Error('Ticket is not transferable');
    }

    // Find recipient user
    const toUser = await prisma.user.findUnique({
      where: { email: toUserEmail },
    });

    if (!toUser) {
      throw new Error('Recipient user not found');
    }

    // Transfer ticket
    const transferred = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        userId: toUser.id,
        metadata: {
          transferredFrom: fromUserId,
          transferredAt: new Date().toISOString(),
        },
      },
      include: {
        event: true,
        ticketType: true,
      },
    });

    await AuditService.log({
      userId: fromUserId,
      action: 'TRANSFER',
      entity: 'Ticket',
      entityId: ticketId,
      metadata: { toUserId: toUser.id, toUserEmail },
    });

    // Get fromUser details
    const fromUser = await prisma.user.findUnique({
      where: { id: fromUserId },
      select: { name: true },
    });

    // Send transfer notification emails
    // Email to recipient
    await notificationService.create({
      userId: toUser.id,
      type: 'TICKET_TRANSFER_RECEIVED',
      title: 'Ticket Transferred to You',
      message: `You have received a ticket for ${ticket.event.name} from ${fromUser?.name || 'another user'}`,
      metadata: { ticketId, eventId: ticket.eventId, fromUserId },
    });

    // Email to sender
    await notificationService.create({
      userId: fromUserId,
      type: 'TICKET_TRANSFER_SENT',
      title: 'Ticket Transfer Completed',
      message: `Your ticket for ${ticket.event.name} has been transferred to ${toUser.name}`,
      metadata: { ticketId, eventId: ticket.eventId, toUserId: toUser.id },
    });

    return transferred;
  }

  /**
   * Validate/check-in a ticket
   */
  static async validate(params: {
    ticketId?: string;
    qrCode?: string;
    validatedBy: string;
  }) {
    const { ticketId, qrCode, validatedBy } = params;

    let ticket;
    if (ticketId) {
      ticket = await this.getById(ticketId);
    } else if (qrCode) {
      ticket = await this.getByQRCode(qrCode);
    } else {
      throw new Error('Either ticketId or qrCode is required');
    }

    // Check if already validated
    if (ticket.status === TicketStatus.USED) {
      throw new Error('Ticket has already been used');
    }

    // Check if ticket is valid
    if (ticket.status !== TicketStatus.VALID) {
      throw new Error('Ticket is not valid');
    }

    // Check if event has started
    const now = new Date();
    if (ticket.event.startDate > now) {
      throw new Error('Event has not started yet');
    }

    // Validate ticket
    const validated = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: TicketStatus.USED,
        metadata: {
          validatedAt: now.toISOString(),
          validatedBy,
        },
      },
      include: {
        event: true,
        ticketType: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await AuditService.log({
      userId: validatedBy,
      action: 'VALIDATE',
      entity: 'Ticket',
      entityId: ticket.id,
      metadata: { eventId: ticket.eventId },
    });

    return validated;
  }

  /**
   * Cancel/refund a ticket
   */
  static async cancel(ticketId: string, userId: string, reason?: string) {
    const ticket = await this.getById(ticketId);

    // Verify ownership or admin
    if (ticket.userId !== userId) {
      // Check if user is admin
      const isAdmin = await PermissionService.hasPermission(userId, 'tickets:cancel:any');
      if (!isAdmin) {
        throw new Error('You do not own this ticket');
      }
    }

    // Check if ticket can be cancelled
    if (ticket.status === TicketStatus.USED) {
      throw new Error('Cannot cancel a used ticket');
    }

    if (ticket.status === TicketStatus.CANCELLED) {
      throw new Error('Ticket is already cancelled');
    }

    // Check refund policy (e.g., 24 hours before event)
    const hoursUntilEvent = (ticket.event.startDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilEvent < 24) {
      throw new Error('Refund period has expired (must be 24 hours before event)');
    }

    const cancelled = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        status: TicketStatus.CANCELLED,
        metadata: {
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason,
        },
      },
    });

    await AuditService.log({
      userId,
      action: 'CANCEL',
      entity: 'Ticket',
      entityId: ticketId,
      metadata: { reason },
    });

    // Process refund if order has payment intent
    const order = await prisma.order.findUnique({
      where: { id: ticket.orderId },
      select: { paymentIntent: true, orderNumber: true },
    });

    if (order?.paymentIntent) {
      try {
        const stripe = getStripeClient();
        // Calculate refund amount (ticket type price)
        const refundAmount = Number(ticket.ticketType.price) * 100; // Convert to cents

        await stripe.refunds.create({
          payment_intent: order.paymentIntent,
          amount: refundAmount,
          reason: 'requested_by_customer',
          metadata: {
            ticketId,
            orderId: ticket.orderId,
            cancellationReason: reason || 'Customer request',
          },
        });
      } catch (error) {
        console.error('Refund failed:', error);
        throw new Error('Failed to process refund');
      }
    }

    // Send cancellation notification
    await notificationService.create({
      userId: ticket.userId,
      type: 'TICKET_CANCELLED',
      title: 'Ticket Cancelled',
      message: `Your ticket for ${ticket.event.name} has been cancelled. ${order?.paymentIntent ? 'Refund will be processed within 5-10 business days.' : ''}`,
      metadata: { ticketId, eventId: ticket.eventId, reason },
    });

    return cancelled;
  }

  /**
   * Get user's tickets
   */
  static async getUserTickets(userId: string, params?: {
    status?: TicketStatus;
    upcoming?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { status, upcoming, page = 1, limit = 20 } = params || {};

    const where: Prisma.TicketWhereInput = {
      userId,
      ...(status && { status }),
      ...(upcoming && {
        event: {
          startDate: { gte: new Date() },
        },
      }),
    };

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          event: {
            select: {
              id: true,
              name: true,
              startDate: true,
              imageUrl: true,
              venue: {
                select: {
                  name: true,
                  city: true,
                  state: true,
                },
              },
            },
          },
          ticketType: true,
        },
        orderBy: {
          event: {
            startDate: 'asc',
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get event tickets with availability
   */
  static async getEventTickets(eventId: string) {
    const ticketTypes = await prisma.ticketType.findMany({
      where: { eventId },
      include: {
        _count: {
          select: {
            tickets: {
              where: {
                status: TicketStatus.VALID,
              },
            },
          },
        },
      },
    });

    return ticketTypes.map((type) => ({
      ...type,
      available: type.quantity - type._count.tickets,
      soldOut: type.quantity - type._count.tickets <= 0,
    }));
  }

  /**
   * Generate unique QR code
   */
  private static async generateQRCode(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let qrCode = '';

    // Generate 12-character code
    for (let i = 0; i < 12; i++) {
      qrCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Check if code already exists
    const existing = await prisma.ticket.findFirst({
      where: { qrCode },
    });

    if (existing) {
      // Recursively generate new code if collision
      return this.generateQRCode();
    }

    return qrCode;
  }

  /**
   * Get ticket statistics for an event
   */
  static async getEventStats(eventId: string) {
    const [total, active, used, cancelled, transferred] = await Promise.all([
      prisma.ticket.count({ where: { eventId } }),
      prisma.ticket.count({ where: { eventId, status: TicketStatus.VALID } }),
      prisma.ticket.count({ where: { eventId, status: TicketStatus.USED } }),
      prisma.ticket.count({ where: { eventId, status: TicketStatus.CANCELLED } }),
      prisma.ticket.count({
        where: {
          eventId,
          metadata: {
            path: ['transferredFrom'],
            not: Prisma.DbNull,
          },
        },
      }),
    ]);

    return {
      total,
      active,
      used,
      cancelled,
      transferred,
      checkInRate: total > 0 ? Math.round((used / total) * 100) : 0,
    };
  }

  /**
   * Bulk validate tickets (for event check-in)
   */
  static async bulkValidate(params: {
    ticketIds: string[];
    validatedBy: string;
  }) {
    const { ticketIds, validatedBy } = params;

    const results = await Promise.allSettled(
      ticketIds.map((ticketId) =>
        this.validate({ ticketId, validatedBy })
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return {
      total: ticketIds.length,
      successful,
      failed,
      results,
    };
  }
}
