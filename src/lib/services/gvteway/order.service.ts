/**
 * GVTEWAY Order Service
 * Handles all order operations for the ticketing platform
 */

import { prisma } from '@/lib/prisma';
import { Prisma, OrderStatus, TicketStatus } from '@prisma/client';
import { AuditService } from '../shared/audit.service';
import { TicketService } from './ticket.service';
import { EmailService } from '../shared/email.service';
import { NotificationService } from '../shared/NotificationService';
import { getStripeClient } from '@/lib/integrations/stripe';

const notificationService = new NotificationService();

export class OrderService {
  /**
   * Get all orders with filtering
   */
  static async getAll(params: {
    userId?: string;
    eventId?: string;
    status?: OrderStatus;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }) {
    const { userId, eventId, status, startDate, endDate, page = 1, limit = 20 } = params;

    const where: Prisma.OrderWhereInput = {
      ...(userId && { userId }),
      ...(eventId && { eventId }),
      ...(status && { status }),
      ...(startDate && { createdAt: { gte: startDate } }),
      ...(endDate && { createdAt: { lte: endDate } }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          event: {
            select: {
              id: true,
              name: true,
              startDate: true,
              imageUrl: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              tickets: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single order by ID
   */
  static async getById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        event: {
          include: {
            venue: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tickets: {
          include: {
            ticketType: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  /**
   * Get order by order number
   */
  static async getByOrderNumber(orderNumber: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        event: {
          include: {
            venue: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tickets: {
          include: {
            ticketType: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  /**
   * Create a new order
   */
  static async create(params: {
    userId: string;
    eventId: string;
    tickets: Array<{
      ticketTypeId: string;
      quantity: number;
      seatNumber?: string;
    }>;
    paymentIntentId?: string;
    metadata?: Prisma.JsonValue;
  }) {
    const { userId, eventId, tickets, paymentIntentId, metadata } = params;

    // Calculate total
    const ticketTypes = await prisma.ticketType.findMany({
      where: {
        id: { in: tickets.map((t) => t.ticketTypeId) },
      },
    });

    let subtotal = 0;
    const ticketItems = [];

    for (const ticket of tickets) {
      const ticketType = ticketTypes.find((tt) => tt.id === ticket.ticketTypeId);
      if (!ticketType) {
        throw new Error(`Ticket type ${ticket.ticketTypeId} not found`);
      }

      // Check availability
      const soldCount = await prisma.ticket.count({
        where: {
          ticketTypeId: ticket.ticketTypeId,
          status: { not: 'CANCELLED' },
        },
      });

      if (soldCount + ticket.quantity > ticketType.quantity) {
        throw new Error(`Not enough tickets available for ${ticketType.name}`);
      }

      const itemTotal = Number(ticketType.price) * ticket.quantity;
      subtotal += itemTotal;

      ticketItems.push({
        ticketTypeId: ticket.ticketTypeId,
        quantity: ticket.quantity,
        price: ticketType.price,
        seatNumber: ticket.seatNumber,
      });
    }

    // Calculate fees (example: 10% service fee)
    const serviceFee = subtotal * 0.1;
    const total = subtotal + serviceFee;

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        eventId,
        orderNumber,
        subtotal,
        tax: 0,
        fees: serviceFee,
        total,
        status: OrderStatus.PENDING,
        paymentIntent: paymentIntentId,
        metadata: metadata || {},
      },
      include: {
        event: true,
      },
    });

    // Create tickets
    const ticketCreationPromises = ticketItems.flatMap((item) =>
      Array.from({ length: item.quantity }, () => ({
        ticketTypeId: item.ticketTypeId,
        seatNumber: item.seatNumber,
      }))
    );

    await TicketService.createForOrder({
      orderId: order.id,
      eventId,
      userId,
      tickets: ticketCreationPromises,
    });

    await AuditService.log({
      userId,
      action: 'CREATE',
      entity: 'Order',
      entityId: order.id,
      metadata: { orderNumber, total, eventId },
    });

    return order;
  }

  /**
   * Update order status
   */
  static async updateStatus(
    orderId: string,
    status: OrderStatus,
    userId: string,
    metadata?: Record<string, unknown>
  ) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(metadata && { metadata: metadata as Prisma.InputJsonValue }),
      },
      include: {
        event: true,
        tickets: true,
      },
    });

    await AuditService.log({
      userId,
      action: 'UPDATE_STATUS',
      entity: 'Order',
      entityId: orderId,
    });

    // Send tickets email with QR codes if order is completed
    if (status === OrderStatus.COMPLETED && order.tickets) {
      const ticketsWithQR = order.tickets.map((ticket: { qrCode: string; seatNumber: string | null }) => ({
        qrCode: ticket.qrCode,
        seatNumber: ticket.seatNumber || undefined,
      }));

      const user = await prisma.user.findUnique({ where: { id: order.userId } });
      if (user?.email && order.event) {
        await EmailService.sendTickets({
          to: user.email,
          eventName: order.event.name,
          tickets: ticketsWithQR,
        });
      }

      // Update ticket statuses to VALID (active)
      await prisma.ticket.updateMany({
        where: { orderId },
        data: { status: TicketStatus.VALID },
      });

      // Send in-app notification
      await notificationService.create({
        userId: order.userId,
        type: 'ORDER_COMPLETED',
        title: 'Order Completed',
        message: `Your order ${order.orderNumber} has been completed. Check your email for tickets.`,
        metadata: { orderId, orderNumber: order.orderNumber },
      });
    }

    return order;
  }

  /**
   * Cancel an order
   */
  static async cancel(orderId: string, userId: string, reason?: string) {
    const order = await this.getById(orderId);

    if (order.status === OrderStatus.COMPLETED) {
      // Check refund policy
      const hoursUntilEvent = order.event ? (order.event.startDate.getTime() - Date.now()) / (1000 * 60 * 60) : 0;
      if (hoursUntilEvent < 24) {
        throw new Error('Refund period has expired (must be 24 hours before event)');
      }
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new Error('Order is already cancelled');
    }

    const cancelled = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        metadata: {
          ...(order.metadata as object),
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason,
        },
      },
    });

    // Cancel all tickets
    await prisma.ticket.updateMany({
      where: { orderId },
      data: {
        status: 'CANCELLED',
      },
    });

    await AuditService.log({
      userId,
      action: 'CANCEL',
      entity: 'Order',
      entityId: orderId,
      metadata: { reason },
    });

    // Process refund if payment was made
    if (order.paymentIntent) {
      try {
        const stripe = getStripeClient();
        const refund = await stripe.refunds.create({
          payment_intent: order.paymentIntent,
          reason: 'requested_by_customer',
          metadata: {
            orderId,
            orderNumber: order.orderNumber,
            cancellationReason: reason || 'Customer request',
          },
        });

        // Update order with refund details
        await prisma.order.update({
          where: { id: orderId },
          data: {
            metadata: {
              ...(cancelled.metadata as object),
              refundId: refund.id,
              refundStatus: refund.status,
              refundAmount: refund.amount,
            },
          },
        });
      } catch (error) {
        console.error('Refund failed:', error);
        throw new Error('Failed to process refund');
      }
    }

    // Send cancellation notification
    await notificationService.create({
      userId,
      type: 'ORDER_CANCELLED',
      title: 'Order Cancelled',
      message: `Your order ${order.orderNumber} has been cancelled. ${order.paymentIntent ? 'Refund will be processed within 5-10 business days.' : ''}`,
      metadata: { orderId, orderNumber: order.orderNumber, reason },
    });

    return cancelled;
  }

  /**
   * Get user's orders
   */
  static async getUserOrders(userId: string, params?: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }) {
    const { status, page = 1, limit = 20 } = params || {};

    const where: Prisma.OrderWhereInput = {
      userId,
      ...(status && { status }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
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
          _count: {
            select: {
              tickets: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get order statistics for an event
   */
  static async getEventStats(eventId: string) {
    const [total, completed, pending, cancelled, totalRevenue] = await Promise.all([
      prisma.order.count({ where: { eventId } }),
      prisma.order.count({ where: { eventId, status: OrderStatus.COMPLETED } }),
      prisma.order.count({ where: { eventId, status: OrderStatus.PENDING } }),
      prisma.order.count({ where: { eventId, status: OrderStatus.CANCELLED } }),
      prisma.order.aggregate({
        where: { eventId, status: OrderStatus.COMPLETED },
        _sum: { total: true },
      }),
    ]);

    return {
      total,
      completed,
      pending,
      cancelled,
      totalRevenue: Number(totalRevenue._sum.total || 0),
      averageOrderValue: completed > 0 ? Number(totalRevenue._sum.total || 0) / completed : 0,
    };
  }

  /**
   * Get order statistics for a user
   */
  static async getUserStats(userId: string) {
    const [total, completed, totalSpent, upcomingEvents] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.count({ where: { userId, status: OrderStatus.COMPLETED } }),
      prisma.order.aggregate({
        where: { userId, status: OrderStatus.COMPLETED },
        _sum: { total: true },
      }),
      prisma.order.count({
        where: {
          userId,
          status: OrderStatus.COMPLETED,
          event: {
            startDate: { gte: new Date() },
          },
        },
      }),
    ]);

    return {
      total,
      completed,
      totalSpent: Number(totalSpent._sum.total || 0),
      upcomingEvents,
    };
  }

  /**
   * Generate unique order number
   */
  private static async generateOrderNumber(): Promise<string> {
    const prefix = 'ORD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `${prefix}-${timestamp}-${random}`;

    // Check if order number already exists
    const existing = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (existing) {
      // Recursively generate new number if collision
      return this.generateOrderNumber();
    }

    return orderNumber;
  }

  /**
   * Process refund for an order
   */
  static async processRefund(orderId: string, userId: string, amount?: number) {
    const order = await this.getById(orderId);

    if (order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED) {
      throw new Error('Order must be completed or cancelled to process refund');
    }

    const refundAmount = amount || Number(order.total);

    // Integrate with payment provider (Stripe) to process refund
    if (order.paymentIntent) {
      const stripe = (await import('stripe')).default;
      const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);
      
      try {
        await stripeClient.refunds.create({
          payment_intent: order.paymentIntent,
          amount: Math.round(refundAmount * 100), // Convert to cents
        });
      } catch (error) {
        console.error('Stripe refund failed:', error);
        throw new Error('Refund processing failed');
      }
    }

    const refunded = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.REFUNDED,
        metadata: {
          ...(order.metadata as object),
          refundedAt: new Date().toISOString(),
          refundAmount,
        },
      },
    });

    await AuditService.log({
      userId,
      action: 'REFUND',
      entity: 'Order',
      entityId: orderId,
      metadata: { refundAmount },
    });

    return refunded;
  }

  /**
   * Get revenue analytics
   */
  static async getRevenueAnalytics(params: {
    eventId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { eventId, startDate, endDate } = params;

    const where: Prisma.OrderWhereInput = {
      status: OrderStatus.COMPLETED,
      ...(eventId && { eventId }),
      ...(startDate && { createdAt: { gte: startDate } }),
      ...(endDate && { createdAt: { lte: endDate } }),
    };

    const [orders, revenue] = await Promise.all([
      prisma.order.findMany({
        where,
        select: {
          total: true,
          createdAt: true,
          eventId: true,
        },
      }),
      prisma.order.aggregate({
        where,
        _sum: {
          total: true,
          subtotal: true,
          fees: true,
          tax: true,
        },
        _avg: {
          total: true,
        },
        _count: true,
      }),
    ]);

    // Group by date
    const dailyRevenue = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += Number(order.total);
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue: Number(revenue._sum.total || 0),
      totalSubtotal: Number(revenue._sum.subtotal || 0),
      totalFees: Number(revenue._sum.fees || 0),
      totalTax: Number(revenue._sum.tax || 0),
      averageOrderValue: Number(revenue._avg.total || 0),
      orderCount: revenue._count,
      dailyRevenue,
    };
  }
}
