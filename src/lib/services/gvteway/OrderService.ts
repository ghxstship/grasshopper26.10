/**
 * GVTEWAY Order Service
 * Handles order processing for consumer platform
 */

import { BaseService, ServiceResult, PaginationOptions, PaginatedResult } from '../base/BaseService';
import { OrderStatus, Prisma } from '@prisma/client';
import { NotificationService } from '../shared/NotificationService';
import { EmailService } from '../shared/EmailService';

export interface CreateOrderInput {
  userId: string;
  eventId?: string;
  items: Array<{
    type: string;
    itemId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  paymentIntent?: string;
  paymentMethod?: string;
}

export interface OrderFilters {
  userId?: string;
  eventId?: string;
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export class OrderService extends BaseService {
  private notificationService: NotificationService;
  private emailService: EmailService;

  constructor() {
    super();
    this.notificationService = new NotificationService();
    this.emailService = new EmailService();
  }

  /**
   * Create a new order
   */
  async create(input: CreateOrderInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      this.validateRequired(input as unknown as Record<string, unknown>, [
        'userId',
        'items',
        'subtotal',
        'tax',
        'fees',
        'total',
      ]);

      if (input.items.length === 0) {
        throw {
          name: 'ValidationError',
          message: 'Order must contain at least one item',
        };
      }

      // Generate unique order number
      const orderNumber = this.generateOrderNumber();

      const order = await this.prisma.order.create({
        data: {
          userId: input.userId,
          eventId: input.eventId,
          orderNumber,
          status: OrderStatus.PENDING,
          subtotal: input.subtotal,
          tax: input.tax,
          fees: input.fees,
          total: input.total,
          currency: input.currency || 'USD',
          metadata: input.metadata as Prisma.InputJsonValue,
          items: {
            create: input.items.map(item => ({
              type: item.type,
              itemId: item.itemId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: true,
          event: true,
        },
      });

      await this.logAudit(input.userId, 'CREATE', 'Order', order.id, {
        orderNumber,
        total: input.total,
      });

      return order;
    }, 'create');
  }

  /**
   * Get order by ID
   */
  async getById(id: string, userId?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: true,
          event: true,
          tickets: true,
        },
      });

      if (!order) {
        throw {
          name: 'NotFoundError',
          message: 'Order not found',
        };
      }

      // Check ownership if userId provided
      if (userId && order.userId !== userId) {
        const hasPermission = await this.checkPermission(userId, 'Order', 'read');
        if (!hasPermission) {
          throw {
            name: 'ForbiddenError',
            message: 'You do not have permission to view this order',
          };
        }
      }

      return order;
    }, 'getById');
  }

  /**
   * Get order by order number
   */
  async getByOrderNumber(orderNumber: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const order = await this.prisma.order.findUnique({
        where: { orderNumber },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: true,
          event: true,
          tickets: true,
        },
      });

      if (!order) {
        throw {
          name: 'NotFoundError',
          message: 'Order not found',
        };
      }

      return order;
    }, 'getByOrderNumber');
  }

  /**
   * List orders with filters and pagination
   */
  async list(
    filters?: OrderFilters,
    pagination?: PaginationOptions
  ): Promise<ServiceResult<PaginatedResult<unknown>>> {
    return this.execute(async () => {
      const { skip, limit } = this.buildPagination(pagination);

      const where: Prisma.OrderWhereInput = {};

      if (filters?.userId) where.userId = filters.userId;
      if (filters?.eventId) where.eventId = filters.eventId;
      if (filters?.status) where.status = filters.status;

      if (filters?.dateFrom || filters?.dateTo) {
        where.createdAt = {
          ...(filters.dateFrom && { gte: filters.dateFrom }),
          ...(filters.dateTo && { lte: filters.dateTo }),
        };
      }

      const [orders, total] = await Promise.all([
        this.prisma.order.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            items: true,
            event: true,
            _count: {
              select: {
                tickets: true,
              },
            },
          },
        }),
        this.prisma.order.count({ where }),
      ]);

      return this.buildPaginatedResult(orders, total, pagination);
    }, 'list');
  }

  /**
   * Update order status
   */
  async updateStatus(
    id: string,
    input: UpdateOrderStatusInput,
    userId: string
  ): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const existing = await this.prisma.order.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Order not found',
        };
      }

      const order = await this.prisma.order.update({
        where: { id },
        data: {
          status: input.status,
          paymentIntent: input.paymentIntent,
          paymentMethod: input.paymentMethod,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: true,
          event: true,
        },
      });

      await this.logAudit(userId, 'UPDATE_STATUS', 'Order', id, {
        oldStatus: existing.status,
        newStatus: input.status,
      });

      // Send notification on completion
      if (input.status === OrderStatus.COMPLETED) {
        await this.notificationService.create({
          userId: order.userId,
          title: 'Order Completed',
          message: `Your order #${order.orderNumber} has been completed`,
          type: 'ORDER_COMPLETED',
          actionUrl: `/orders/${order.id}`,
        });

        await this.emailService.sendOrderConfirmation(existing.user.email, {
          orderNumber: order.orderNumber,
          total: order.total.toString(),
          items: order.items,
        });
      }

      return order;
    }, 'updateStatus');
  }

  /**
   * Cancel order
   */
  async cancel(id: string, userId: string, reason?: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const existing = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          name: 'NotFoundError',
          message: 'Order not found',
        };
      }

      if (existing.userId !== userId) {
        throw {
          name: 'ForbiddenError',
          message: 'You do not own this order',
        };
      }

      if (existing.status === OrderStatus.COMPLETED) {
        throw {
          name: 'ValidationError',
          message: 'Completed orders cannot be cancelled',
        };
      }

      const order = await this.prisma.order.update({
        where: { id },
        data: {
          status: OrderStatus.CANCELLED,
        },
      });

      await this.logAudit(userId, 'CANCEL', 'Order', id, { reason });

      // Process refund if payment was made
      if (order.paymentIntent && order.status === OrderStatus.COMPLETED) {
        const { RefundService } = await import('../shared/RefundService');
        const refundService = new RefundService();
        
        try {
          const refundResult = await refundService.processRefund({
            paymentIntentId: order.paymentIntent,
            reason: 'requested_by_customer',
            metadata: {
              orderId: order.id,
              userId,
              reason: reason || 'Customer requested cancellation',
            },
          });

          if (refundResult.success && refundResult.data) {
            console.log('Order refund processed:', refundResult.data);
            
            // Update order with refund information
            await this.prisma.order.update({
              where: { id },
              data: {
                status: OrderStatus.REFUNDED,
                metadata: {
                  ...(order.metadata as object || {}),
                  refundId: refundResult.data.refundId,
                  refundAmount: refundResult.data.amount,
                  refundedAt: new Date().toISOString(),
                  refundReason: reason,
                },
              },
            });
          }
        } catch (error) {
          console.error('Failed to process order refund:', error);
          // Don't fail the cancellation if refund fails - log for manual processing
          throw new Error('Order cancelled but refund processing failed. Please contact support.');
        }
      }

      return order;
    }, 'cancel');
  }

  /**
   * Generate unique order number
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Get user's orders
   */
  async getUserOrders(userId: string): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const orders = await this.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          event: true,
          _count: {
            select: {
              tickets: true,
            },
          },
        },
      });

      return orders;
    }, 'getUserOrders');
  }

  /**
   * Get order statistics
   */
  async getStatistics(filters?: OrderFilters): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const where: Prisma.OrderWhereInput = {};

      if (filters?.userId) where.userId = filters.userId;
      if (filters?.eventId) where.eventId = filters.eventId;
      if (filters?.status) where.status = filters.status;

      const [total, byStatus, revenue] = await Promise.all([
        this.prisma.order.count({ where }),
        this.prisma.order.groupBy({
          by: ['status'],
          where,
          _count: true,
        }),
        this.prisma.order.aggregate({
          where: {
            ...where,
            status: OrderStatus.COMPLETED,
          },
          _sum: {
            total: true,
            subtotal: true,
            tax: true,
            fees: true,
          },
        }),
      ]);

      return {
        total,
        byStatus,
        revenue: {
          total: revenue._sum.total || 0,
          subtotal: revenue._sum.subtotal || 0,
          tax: revenue._sum.tax || 0,
          fees: revenue._sum.fees || 0,
        },
      };
    }, 'getStatistics');
  }
}
