/**
 * GVTEWAY Event Service
 * Handles all event operations for the ticketing platform
 */

import { prisma } from '@/lib/prisma';
import { EventStatus, Prisma, TicketStatus } from '@prisma/client';
import { AuditService } from '../shared/audit.service';
import { NotificationService } from '../shared/NotificationService';
import { getStripeClient } from '@/lib/integrations/stripe';

const notificationService = new NotificationService();

export class EventService {
  /**
   * Get all events with filtering and pagination
   */
  static async getAll(params: {
    status?: EventStatus;
    category?: string;
    venueId?: string;
    artistId?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const {
      status,
      venueId,
      startDate,
      endDate,
      search,
      featured,
      page = 1,
      limit = 20,
    } = params;
    
    // artistId available for future filtering if needed

    const where: Prisma.EventWhereInput = {
      ...(status && { status }),
      ...(venueId && { venueId }),
      ...(featured !== undefined && { featured }),
      ...(startDate && { startDate: { gte: startDate } }),
      ...(endDate && { endDate: { lte: endDate } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
            },
          },
          artists: {
            select: {
              id: true,
              artistId: true,
            },
          },
          _count: {
            select: {
              tickets: true,
            },
          },
        },
        orderBy: {
          startDate: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single event by ID
   */
  static async getById(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        venue: true,
        artists: true,
        tickets: {
          where: {
            status: 'VALID',
          },
        },
        _count: {
          select: {
            tickets: true,
            orders: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return event;
  }

  /**
   * Create a new event
   */
  static async create(data: {
    name: string;
    description?: string;
    categoryId?: string;
    startDate: Date;
    endDate?: Date;
    organizationId: string;
    slug: string;
    timezone?: string;
    venueId?: string;
    imageUrl?: string;
    featured?: boolean;
    capacity?: number;
    createdBy: string;
    metadata?: Prisma.JsonValue;
  }) {
    const event = await prisma.event.create({
      data: {
        ...data,
        status: EventStatus.DRAFT,
        featured: data.featured || false,
      } as any,
      include: {
        venue: true,
        artists: true,
      },
    });

    await AuditService.log({
      userId: data.createdBy,
      action: 'CREATE',
      entity: 'Event',
      entityId: event.id,
      metadata: { name: data.name, startDate: data.startDate },
    });

    return event;
  }

  /**
   * Update an event
   */
  static async update(
    id: string,
    userId: string,
    data: Partial<{
      name: string;
      description: string;
      categoryId: string;
      startDate: Date;
      endDate: Date;
      venueId: string;
      imageUrl: string;
      featured: boolean;
      capacity: number;
      status: EventStatus;
      metadata: Prisma.JsonValue;
    }>
  ) {
    const updated = await prisma.event.update({
      where: { id },
      data,
      include: {
        venue: true,
        artists: true,
      },
    });

    await AuditService.log({
      userId,
      action: 'UPDATE',
      entity: 'Event',
      entityId: id,
      metadata: data as Record<string, unknown>,
    });

    return updated;
  }

  /**
   * Delete an event
   */
  static async delete(id: string, userId: string) {
    // Check if event has sold tickets (VALID or USED status indicates sold tickets)
    const soldTickets = await prisma.ticket.count({
      where: {
        eventId: id,
        status: { in: ['VALID', 'USED', 'TRANSFERRED'] },
      },
    });

    if (soldTickets > 0) {
      throw new Error('Cannot delete event with sold tickets');
    }

    await prisma.event.delete({
      where: { id },
    });

    await AuditService.log({
      userId,
      action: 'DELETE',
      entity: 'Event',
      entityId: id,
    });

    return { success: true };
  }

  /**
   * Publish an event
   */
  static async publish(id: string, userId: string) {
    const event = await this.getById(id);

    // Validate event has required data
    if (!event.venueId) {
      throw new Error('Event must have a venue before publishing');
    }

    // Check if event has ticket types (would need to query separately)
    const ticketCount = await prisma.ticketType.count({
      where: { eventId: id },
    });
    
    if (ticketCount === 0) {
      throw new Error('Event must have ticket types before publishing');
    }

    const published = await prisma.event.update({
      where: { id },
      data: {
        status: EventStatus.PUBLISHED,
      },
    });

    await AuditService.log({
      userId,
      action: 'PUBLISH',
      entity: 'Event',
      entityId: id,
    });

    return published;
  }

  /**
   * Cancel an event
   */
  static async cancel(id: string, userId: string, reason?: string) {
    const cancelled = await prisma.event.update({
      where: { id },
      data: {
        status: EventStatus.CANCELLED,
        metadata: {
          cancellationReason: reason,
        } as Prisma.InputJsonValue,
      },
    });

    // Trigger refunds for all sold tickets
    const tickets = await prisma.ticket.findMany({
      where: {
        eventId: id,
        status: { in: [TicketStatus.VALID, TicketStatus.TRANSFERRED] },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        order: {
          select: {
            id: true,
            paymentIntent: true,
          },
        },
      },
    });

    // Process refunds for each unique order
    const processedOrders = new Set<string>();
    const stripe = getStripeClient();
    for (const ticket of tickets) {
      if (ticket.order?.paymentIntent && !processedOrders.has(ticket.orderId)) {
        processedOrders.add(ticket.orderId);
        try {
          await stripe.refunds.create({
            payment_intent: ticket.order.paymentIntent,
            reason: 'requested_by_customer',
            metadata: {
              eventId: id,
              orderId: ticket.orderId,
              reason: 'Event cancelled',
            },
          });
        } catch (error) {
          console.error(`Refund failed for order ${ticket.orderId}:`, error);
        }
      }
    }

    // Cancel all tickets
    await prisma.ticket.updateMany({
      where: { eventId: id },
      data: { status: TicketStatus.CANCELLED },
    });

    // Send cancellation notifications to all ticket holders
    const uniqueUsers = new Map<string, { id: string; email: string; name: string | null }>();
    for (const ticket of tickets) {
      if (!uniqueUsers.has(ticket.user.id)) {
        uniqueUsers.set(ticket.user.id, ticket.user);
      }
    }

    for (const user of uniqueUsers.values()) {
      await notificationService.create({
        userId: user.id,
        type: 'EVENT_CANCELLED',
        title: 'Event Cancelled',
        message: `The event "${cancelled.name}" has been cancelled. ${reason ? `Reason: ${reason}` : ''} Refunds will be processed within 5-10 business days.`,
        metadata: { eventId: id, reason },
      });
    }

    await AuditService.log({
      userId,
      action: 'CANCEL',
      entity: 'Event',
      entityId: id,
      metadata: { reason },
    });

    return cancelled;
  }

  /**
   * Get event analytics
   */
  static async getAnalytics(id: string) {
    const event = await this.getById(id);

    const [ticketStats, revenueStats, attendeeStats] = await Promise.all([
      this.getTicketStats(id),
      this.getRevenueStats(id),
      this.getAttendeeStats(id),
    ]);

    return {
      event: {
        id: event.id,
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        status: event.status,
      },
      tickets: ticketStats,
      revenue: revenueStats,
      attendees: attendeeStats,
    };
  }

  /**
   * Get ticket statistics
   */
  private static async getTicketStats(eventId: string) {
    const [total, used, valid, reserved] = await Promise.all([
      prisma.ticket.count({ where: { eventId } }),
      prisma.ticket.count({ where: { eventId, status: 'USED' } }),
      prisma.ticket.count({ where: { eventId, status: 'VALID' } }),
      prisma.ticket.count({ where: { eventId, status: 'CANCELLED' } }),
    ]);

    return {
      total,
      used,
      valid,
      reserved,
      usedPercentage: total > 0 ? Math.round((used / total) * 100) : 0,
    };
  }

  /**
   * Get revenue statistics
   */
  private static async getRevenueStats(eventId: string) {
    // Get ticket types with sold count
    const ticketTypes = await prisma.ticketType.findMany({
      where: { eventId },
      select: {
        price: true,
        sold: true,
      },
    });

    let totalRevenue = 0;
    let totalTickets = 0;

    ticketTypes.forEach(ticketType => {
      totalTickets += ticketType.sold;
      totalRevenue += ticketType.sold * Number(ticketType.price);
    });

    const averageTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;

    return {
      totalRevenue,
      averageTicketPrice,
      ticketsSold: totalTickets,
    };
  }

  /**
   * Get attendee statistics
   */
  private static async getAttendeeStats(eventId: string) {
    const orders = await prisma.order.findMany({
      where: {
        eventId,
        status: 'COMPLETED',
      },
      select: {
        userId: true,
      },
      distinct: ['userId'],
    });

    return {
      uniqueAttendees: orders.length,
    };
  }

  /**
   * Search events
   */
  static async search(params: {
    query: string;
    categoryId?: string;
    city?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { query, categoryId, city, startDate, endDate, page = 1, limit = 20 } = params;

    const where: Prisma.EventWhereInput = {
      status: EventStatus.PUBLISHED,
      ...(categoryId && { categoryId }),
      ...(city && {
        venue: {
          city: { contains: city, mode: 'insensitive' },
        },
      }),
      ...(startDate && { startDate: { gte: startDate } }),
      ...(endDate && { endDate: { lte: endDate } }),
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        {
          artists: {
            some: {
              artist: {
                name: { contains: query, mode: 'insensitive' },
              },
            },
          },
        },
        {
          venue: {
            name: { contains: query, mode: 'insensitive' },
          },
        },
      ],
    };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              city: true,
              state: true,
            },
          },
          artists: {
            select: {
              id: true,
              artist: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
        orderBy: {
          startDate: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get featured events
   */
  static async getFeatured(limit = 10) {
    return prisma.event.findMany({
      where: {
        status: EventStatus.PUBLISHED,
        featured: true,
        startDate: { gte: new Date() },
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
          },
        },
        artists: {
          include: {
            artist: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: limit,
    });
  }

  /**
   * Get upcoming events
   */
  static async getUpcoming(limit = 20) {
    return prisma.event.findMany({
      where: {
        status: EventStatus.PUBLISHED,
        startDate: { gte: new Date() },
      },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
          },
        },
        artists: {
          include: {
            artist: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: limit,
    });
  }
}
