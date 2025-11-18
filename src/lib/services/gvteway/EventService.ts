/**
 * GVTEWAY Event Service
 * Handles event management operations for consumer platform
 */

import { BaseService, ServiceResult, PaginationOptions, PaginatedResult } from '../base/BaseService';
import { EventStatus, EventVisibility, Prisma } from '@prisma/client';

export interface CreateEventInput {
  organizationId: string;
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  bannerUrl?: string;
  categoryId?: string;
  venueId?: string;
  startDate: Date;
  endDate?: Date;
  timezone: string;
  capacity?: number;
  featured?: boolean;
  visibility?: EventVisibility;
  metadata?: Record<string, unknown>;
}

export interface UpdateEventInput {
  name?: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  bannerUrl?: string;
  categoryId?: string;
  venueId?: string;
  startDate?: Date;
  endDate?: Date;
  timezone?: string;
  status?: EventStatus;
  visibility?: EventVisibility;
  capacity?: number;
  featured?: boolean;
  metadata?: Record<string, unknown>;
}

export interface EventFilters {
  organizationId?: string;
  categoryId?: string;
  venueId?: string;
  status?: EventStatus;
  visibility?: EventVisibility;
  featured?: boolean;
  startDateFrom?: Date;
  startDateTo?: Date;
  search?: string;
}

export class EventService extends BaseService {
  /**
   * Create a new event
   */
  async create(input: CreateEventInput, userId: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, [
        'organizationId',
        'name',
        'startDate',
        'timezone',
      ]);

      // Generate slug if not provided
      const slug = input.slug || this.generateSlug(input.name);

      const event = await this.prisma.event.create({
        data: {
          organizationId: input.organizationId,
          name: input.name,
          slug,
          description: input.description,
          shortDescription: input.shortDescription,
          imageUrl: input.imageUrl,
          bannerUrl: input.bannerUrl,
          categoryId: input.categoryId,
          venueId: input.venueId,
          startDate: input.startDate,
          endDate: input.endDate,
          timezone: input.timezone,
          status: EventStatus.DRAFT,
          visibility: input.visibility || EventVisibility.PUBLIC,
          capacity: input.capacity,
          featured: input.featured || false,
          metadata: input.metadata as Prisma.InputJsonValue,
        },
        include: {
          organization: true,
          category: true,
          venue: true,
        },
      });

      await this.logAudit(userId, 'CREATE', 'Event', event.id, {
        name: input.name,
        slug,
      });

      return event;
    }, 'create');
  }

  /**
   * Get event by ID
   */
  async getById(id: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const event = await this.prisma.event.findUnique({
        where: { id },
        include: {
          organization: true,
          category: true,
          venue: true,
          artists: {
            include: {
              artist: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          ticketTypes: {
            orderBy: {
              price: 'asc',
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
        throw {
          name: 'NotFoundError',
          message: 'Event not found',
        };
      }

      return event;
    }, 'getById');
  }

  /**
   * Get event by slug
   */
  async getBySlug(slug: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const event = await this.prisma.event.findUnique({
        where: { slug },
        include: {
          organization: true,
          category: true,
          venue: true,
          artists: {
            include: {
              artist: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          ticketTypes: {
            orderBy: {
              price: 'asc',
            },
          },
        },
      });

      if (!event) {
        throw {
          name: 'NotFoundError',
          message: 'Event not found',
        };
      }

      return event;
    }, 'getBySlug');
  }

  /**
   * List events with filters and pagination
   */
  async list(
    filters?: EventFilters,
    pagination?: PaginationOptions
  ): Promise<ServiceResult<PaginatedResult<unknown>>> {
    return this.execute(async () => {
      const { skip, limit } = this.buildPagination(pagination);

      const where: Prisma.EventWhereInput = {};

      if (filters?.organizationId) where.organizationId = filters.organizationId;
      if (filters?.categoryId) where.categoryId = filters.categoryId;
      if (filters?.venueId) where.venueId = filters.venueId;
      if (filters?.status) where.status = filters.status;
      if (filters?.visibility) where.visibility = filters.visibility;
      if (filters?.featured !== undefined) where.featured = filters.featured;

      if (filters?.startDateFrom || filters?.startDateTo) {
        where.startDate = {
          ...(filters.startDateFrom && { gte: filters.startDateFrom }),
          ...(filters.startDateTo && { lte: filters.startDateTo }),
        };
      }

      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const [events, total] = await Promise.all([
        this.prisma.event.findMany({
          where,
          skip,
          take: limit,
          orderBy: { startDate: 'asc' },
          include: {
            organization: true,
            category: true,
            venue: true,
            artists: {
              include: {
                artist: true,
              },
              take: 3,
            },
            _count: {
              select: {
                tickets: true,
              },
            },
          },
        }),
        this.prisma.event.count({ where }),
      ]);

      return this.buildPaginatedResult(events, total, pagination);
    }, 'list');
  }

  /**
   * Update event
   */
  async update(
    id: string,
    input: UpdateEventInput,
    userId: string
  ): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const existing = await this.prisma.event.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Event not found',
        };
      }

      const event = await this.prisma.event.update({
        where: { id },
        data: {
          name: input.name,
          description: input.description,
          shortDescription: input.shortDescription,
          imageUrl: input.imageUrl,
          bannerUrl: input.bannerUrl,
          categoryId: input.categoryId,
          venueId: input.venueId,
          startDate: input.startDate,
          endDate: input.endDate,
          timezone: input.timezone,
          status: input.status,
          visibility: input.visibility,
          capacity: input.capacity,
          featured: input.featured,
          metadata: input.metadata as Prisma.InputJsonValue,
        },
        include: {
          organization: true,
          category: true,
          venue: true,
        },
      });

      await this.logAudit(userId, 'UPDATE', 'Event', id, {
        changes: input,
      });

      return event;
    }, 'update');
  }

  /**
   * Delete event
   */
  async delete(id: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      const existing = await this.prisma.event.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Event not found',
        };
      }

      await this.prisma.event.delete({
        where: { id },
      });

      await this.logAudit(userId, 'DELETE', 'Event', id);
    }, 'delete');
  }

  /**
   * Publish event
   */
  async publish(id: string, userId: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const event = await this.prisma.event.update({
        where: { id },
        data: {
          status: EventStatus.PUBLISHED,
        },
      });

      await this.logAudit(userId, 'PUBLISH', 'Event', id);

      return event;
    }, 'publish');
  }

  /**
   * Cancel event
   */
  async cancel(id: string, userId: string, reason?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const event = await this.prisma.event.update({
        where: { id },
        data: {
          status: EventStatus.CANCELLED,
        },
      });

      await this.logAudit(userId, 'CANCEL', 'Event', id, { reason });

      // Send cancellation notifications to ticket holders
      const tickets = await this.prisma.ticket.findMany({
        where: { eventId: id },
        include: {
          user: { select: { email: true, name: true } },
          order: true,
        },
      });

      // Process refunds for all tickets
      const { RefundService } = await import('../shared/RefundService');
      const refundService = new RefundService();
      
      const refundPromises = tickets
        .filter(ticket => ticket.orderId)
        .map(async (ticket) => {
          try {
            const order = await this.prisma.order.findUnique({ where: { id: ticket.orderId } });
            if (!order?.paymentIntent) return null;
            
            const refundResult = await refundService.processRefund({
              paymentIntentId: order.paymentIntent,
              reason: 'requested_by_customer',
              metadata: {
                eventId: id,
                ticketId: ticket.id,
                orderId: ticket.orderId,
                reason: 'Event cancelled',
              },
            });

            if (refundResult.success) {
              // Update ticket status
              await this.prisma.ticket.update({
                where: { id: ticket.id },
                data: { status: 'REFUNDED' },
              });
            }

            return { ticketId: ticket.id, success: true };
          } catch (error) {
            console.error(`Failed to refund ticket ${ticket.id}:`, error);
            return { ticketId: ticket.id, success: false, error };
          }
        });

      const refundResults = await Promise.allSettled(refundPromises);
      console.log('Event cancellation refunds processed:', refundResults);

      // Send email notifications (using EmailService)
      const { EmailService } = await import('../shared/EmailService');
      const emailService = new EmailService();
      
      for (const ticket of tickets) {
        if (ticket.user?.email) {
          await emailService.send({
            to: ticket.user.email,
            subject: `Event Cancelled: ${event.name}`,
            html: `
              <h1>Event Cancelled</h1>
              <p>Dear ${ticket.user.name || 'Valued Customer'},</p>
              <p>We regret to inform you that the event "${event.name}" scheduled for ${new Date(event.startDate).toLocaleDateString()} has been cancelled.</p>
              <p><strong>Reason:</strong> ${reason || 'Unforeseen circumstances'}</p>
              <p><strong>Ticket ID:</strong> ${ticket.id}</p>
              <p>Your ticket will be automatically refunded. If you have any questions, please contact support.</p>
            `,
          }).catch(err => console.error('Failed to send cancellation email:', err));
        }
      }

      return event;
    }, 'cancel');
  }

  /**
   * Get event analytics
   */
  async getAnalytics(id: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const [ticketStats, orderStats, revenue] = await Promise.all([
        this.prisma.ticket.groupBy({
          by: ['status'],
          where: { eventId: id },
          _count: true,
        }),
        this.prisma.order.groupBy({
          by: ['status'],
          where: { eventId: id },
          _count: true,
        }),
        this.prisma.order.aggregate({
          where: {
            eventId: id,
            status: 'COMPLETED',
          },
          _sum: {
            total: true,
          },
        }),
      ]);

      return {
        tickets: ticketStats,
        orders: orderStats,
        totalRevenue: revenue._sum.total || 0,
      };
    }, 'getAnalytics');
  }

  /**
   * Get featured events
   */
  async getFeatured(limit = 10): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const events = await this.prisma.event.findMany({
        where: {
          featured: true,
          status: EventStatus.PUBLISHED,
          visibility: EventVisibility.PUBLIC,
          startDate: {
            gte: new Date(),
          },
        },
        take: limit,
        orderBy: {
          startDate: 'asc',
        },
        include: {
          organization: true,
          category: true,
          venue: true,
          artists: {
            include: {
              artist: true,
            },
            take: 3,
          },
        },
      });

      return events;
    }, 'getFeatured');
  }

  /**
   * Get upcoming events
   */
  async getUpcoming(limit = 20): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const events = await this.prisma.event.findMany({
        where: {
          status: EventStatus.PUBLISHED,
          visibility: EventVisibility.PUBLIC,
          startDate: {
            gte: new Date(),
          },
        },
        take: limit,
        orderBy: {
          startDate: 'asc',
        },
        include: {
          organization: true,
          category: true,
          venue: true,
        },
      });

      return events;
    }, 'getUpcoming');
  }
}
