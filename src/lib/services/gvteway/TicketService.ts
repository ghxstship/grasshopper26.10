/**
 * GVTEWAY Ticket Service
 * Handles ticket operations for consumer platform
 */

import { BaseService, ServiceResult, PaginationOptions, PaginatedResult } from '../base/BaseService';
import { TicketStatus, Prisma } from '@prisma/client';
import { NotificationService } from '../shared/NotificationService';
import { EmailService } from '../shared/EmailService';

export interface PurchaseTicketInput {
  userId: string;
  eventId: string;
  ticketTypeId: string;
  orderId: string;
  quantity?: number;
  seatNumber?: string;
  metadata?: Record<string, unknown>;
}

export interface TransferTicketInput {
  ticketId: string;
  fromUserId: string;
  toUserId: string;
  toEmail?: string;
}

export interface TicketFilters {
  userId?: string;
  eventId?: string;
  orderId?: string;
  status?: TicketStatus;
}

export class TicketService extends BaseService {
  private notificationService: NotificationService;
  private emailService: EmailService;

  constructor() {
    super();
    this.notificationService = new NotificationService();
    this.emailService = new EmailService();
  }

  /**
   * Purchase/create tickets
   */
  async purchase(input: PurchaseTicketInput): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, [
        'userId',
        'eventId',
        'ticketTypeId',
        'orderId',
      ]);

      const quantity = input.quantity || 1;
      const tickets = [];

      // Create tickets
      for (let i = 0; i < quantity; i++) {
        const qrCode = this.generateQRCode();
        
        const ticket = await this.prisma.ticket.create({
          data: {
            eventId: input.eventId,
            ticketTypeId: input.ticketTypeId,
            userId: input.userId,
            orderId: input.orderId,
            qrCode,
            status: TicketStatus.VALID,
            seatNumber: input.seatNumber,
            metadata: input.metadata as Prisma.InputJsonValue,
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

        tickets.push(ticket);
      }

      await this.logAudit(input.userId, 'PURCHASE', 'Ticket', undefined, {
        eventId: input.eventId,
        quantity,
      });

      // Send ticket delivery email
      const user = tickets[0].user;
      await this.emailService.sendTicketDelivery(user.email, {
        tickets: tickets.map(t => ({
          id: t.id,
          qrCode: t.qrCode,
          event: t.event.name,
        })),
      });

      return tickets;
    }, 'purchase');
  }

  /**
   * Get ticket by ID
   */
  async getById(id: string, userId?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id },
        include: {
          event: {
            include: {
              venue: true,
              organization: true,
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
          nftTicket: true,
          walletPass: true,
        },
      });

      if (!ticket) {
        throw {
          name: 'NotFoundError',
          message: 'Ticket not found',
        };
      }

      // Check ownership if userId provided
      if (userId && ticket.userId !== userId) {
        const hasPermission = await this.checkPermission(userId, 'Ticket', 'read');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to view this ticket',
          };
        }
      }

      return ticket;
    }, 'getById');
  }

  /**
   * Get ticket by QR code
   */
  async getByQRCode(qrCode: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const ticket = await this.prisma.ticket.findUnique({
        where: { qrCode },
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

      if (!ticket) {
        throw {
          name: 'NotFoundError',
          message: 'Ticket not found',
        };
      }

      return ticket;
    }, 'getByQRCode');
  }

  /**
   * List tickets with filters and pagination
   */
  async list(
    filters?: TicketFilters,
    pagination?: PaginationOptions
  ): Promise<ServiceResult<PaginatedResult<unknown>>> {
    return this.execute(async () => {
      const { skip, limit } = this.buildPagination(pagination);

      const where: Prisma.TicketWhereInput = {};

      if (filters?.userId) where.userId = filters.userId;
      if (filters?.eventId) where.eventId = filters.eventId;
      if (filters?.orderId) where.orderId = filters.orderId;
      if (filters?.status) where.status = filters.status;

      const [tickets, total] = await Promise.all([
        this.prisma.ticket.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            event: true,
            ticketType: true,
          },
        }),
        this.prisma.ticket.count({ where }),
      ]);

      return this.buildPaginatedResult(tickets, total, pagination);
    }, 'list');
  }

  /**
   * Validate ticket (for entry)
   */
  async validate(qrCode: string, validatedBy: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const ticket = await this.prisma.ticket.findUnique({
        where: { qrCode },
        include: {
          event: true,
        },
      });

      if (!ticket) {
        throw {
          name: 'NotFoundError',
          message: 'Ticket not found',
        };
      }

      if (ticket.status !== TicketStatus.VALID) {
        throw {
          name: 'ValidationError',
          message: `Ticket is ${ticket.status.toLowerCase()} and cannot be used`,
        };
      }

      // Check if event has started
      const now = new Date();
      if (ticket.event.startDate > now) {
        throw {
          name: 'ValidationError',
          message: 'Event has not started yet',
        };
      }

      // Mark ticket as used
      const updatedTicket = await this.prisma.ticket.update({
        where: { id: ticket.id },
        data: {
          status: TicketStatus.USED,
        },
        include: {
          event: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await this.logAudit(validatedBy, 'VALIDATE', 'Ticket', ticket.id, {
        qrCode,
        eventId: ticket.eventId,
      });

      return updatedTicket;
    }, 'validate');
  }

  /**
   * Transfer ticket to another user
   */
  async transfer(input: TransferTicketInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: input.ticketId },
        include: {
          event: true,
        },
      });

      if (!ticket) {
        throw {
          name: 'NotFoundError',
          message: 'Ticket not found',
        };
      }

      if (ticket.userId !== input.fromUserId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not own this ticket',
        };
      }

      if (ticket.status !== TicketStatus.VALID) {
        throw {
          name: 'ValidationError',
          message: 'Only valid tickets can be transferred',
        };
      }

      // Update ticket ownership
      const updatedTicket = await this.prisma.ticket.update({
        where: { id: input.ticketId },
        data: {
          userId: input.toUserId,
          status: TicketStatus.TRANSFERRED,
        },
        include: {
          event: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await this.logAudit(input.fromUserId, 'TRANSFER', 'Ticket', input.ticketId, {
        toUserId: input.toUserId,
      });

      // Send notification to new owner
      await this.notificationService.create({
        userId: input.toUserId,
        title: 'Ticket Transferred',
        message: `You have received a ticket for ${ticket.event.name}`,
        type: 'TICKET_TRANSFER',
        actionUrl: `/tickets/${input.ticketId}`,
      });

      return updatedTicket;
    }, 'transfer');
  }

  /**
   * Cancel/refund ticket
   */
  async cancel(ticketId: string, userId: string, reason?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const ticket = await this.prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) {
        throw {
          name: 'NotFoundError',
          message: 'Ticket not found',
        };
      }

      if (ticket.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not own this ticket',
        };
      }

      if (ticket.status !== TicketStatus.VALID) {
        throw {
          name: 'ValidationError',
          message: 'Only valid tickets can be cancelled',
        };
      }

      const updatedTicket = await this.prisma.ticket.update({
        where: { id: ticketId },
        data: {
          status: TicketStatus.CANCELLED,
        },
      });

      await this.logAudit(userId, 'CANCEL', 'Ticket', ticketId, { reason });

      // Process refund via Stripe if payment was made
      if (ticket.orderId) {
        const order = await this.prisma.order.findUnique({ where: { id: ticket.orderId } });
        if (order?.paymentIntent) {
          const { RefundService } = await import('../shared/RefundService');
          const refundService = new RefundService();
          
          try {
            const refundResult = await refundService.processRefund({
              paymentIntentId: order.paymentIntent,
            reason: 'requested_by_customer',
            metadata: {
              ticketId: ticket.id,
              orderId: ticket.orderId,
              userId,
            },
          });

          if (refundResult.success && refundResult.data) {
            console.log('Ticket refund processed:', refundResult.data);
            
            // Update order with refund information
            await this.prisma.order.update({
              where: { id: ticket.orderId },
              data: {
                metadata: {
                  ...(order.metadata as object || {}),
                  refundId: refundResult.data.refundId,
                  refundAmount: refundResult.data.amount,
                  refundedAt: new Date().toISOString(),
                },
              },
            });
          }
          } catch (error) {
            console.error('Failed to process ticket refund:', error);
            // Don't fail the cancellation if refund fails - log for manual processing
          }
        }
      }

      return updatedTicket;
    }, 'cancel');
  }

  /**
   * Generate QR code string
   */
  private generateQRCode(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `TKT-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Get user's tickets
   */
  async getUserTickets(userId: string, includeUsed = false): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const where: Prisma.TicketWhereInput = {
        userId,
        ...((!includeUsed && {
          status: {
            in: [TicketStatus.VALID, TicketStatus.TRANSFERRED],
          },
        })),
      };

      const tickets = await this.prisma.ticket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            include: {
              venue: true,
            },
          },
          ticketType: true,
        },
      });

      return tickets;
    }, 'getUserTickets');
  }

  /**
   * Get event tickets (for organizers)
   */
  async getEventTickets(eventId: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const [tickets, stats] = await Promise.all([
        this.prisma.ticket.findMany({
          where: { eventId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            ticketType: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.ticket.groupBy({
          by: ['status'],
          where: { eventId },
          _count: true,
        }),
      ]);

      return {
        tickets,
        stats,
      };
    }, 'getEventTickets');
  }
}
