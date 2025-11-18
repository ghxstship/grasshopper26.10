/**
 * Notification Service
 * Handles all notification operations across platforms
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class NotificationService {
  /**
   * Get all notifications for a user
   */
  static async getAll(params: {
    userId: string;
    read?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const { userId, read, type, page = 1, limit = 20 } = params;

    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(read !== undefined && { read }),
      ...(type && { type }),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, read: false },
      }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single notification
   */
  static async getById(id: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  /**
   * Create a notification
   */
  static async create(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
    metadata?: Prisma.JsonValue;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl,
        read: false,
        metadata: data.metadata || {},
      },
    });
  }

  /**
   * Create bulk notifications
   */
  static async createBulk(
    userIds: string[],
    data: {
      type: string;
      title: string;
      message: string;
      actionUrl?: string;
      metadata?: Prisma.JsonValue;
    }
  ) {
    const notifications = userIds.map((userId) => ({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      actionUrl: data.actionUrl,
      read: false,
      metadata: data.metadata || {},
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    return { count: notifications.length };
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return { success: true };
  }

  /**
   * Delete a notification
   */
  static async delete(id: string) {
    await prisma.notification.delete({
      where: { id },
    });

    return { success: true };
  }

  /**
   * Delete all read notifications for a user
   */
  static async deleteAllRead(userId: string) {
    await prisma.notification.deleteMany({
      where: {
        userId,
        read: true,
      },
    });

    return { success: true };
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return { count };
  }

  /**
   * Send notification (helper method)
   */
  static async send(params: {
    userId: string | string[];
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
    metadata?: Prisma.JsonValue;
  }) {
    const { userId, type, title, message, actionUrl, metadata } = params;

    if (Array.isArray(userId)) {
      return this.createBulk(userId, { type, title, message, actionUrl, metadata });
    } else {
      return this.create({ userId, type, title, message, actionUrl, metadata });
    }
  }

  /**
   * Notification templates
   */
  static templates = {
    orderConfirmed: (orderNumber: string) => ({
      type: 'ORDER_CONFIRMED',
      title: 'Order Confirmed',
      message: `Your order ${orderNumber} has been confirmed.`,
    }),

    ticketPurchased: (eventName: string) => ({
      type: 'TICKET_PURCHASED',
      title: 'Ticket Purchased',
      message: `Your ticket for ${eventName} has been purchased.`,
    }),

    eventReminder: (eventName: string, hours: number) => ({
      type: 'EVENT_REMINDER',
      title: 'Event Reminder',
      message: `${eventName} starts in ${hours} hours.`,
    }),

    taskAssigned: (taskName: string) => ({
      type: 'TASK_ASSIGNED',
      title: 'Task Assigned',
      message: `You have been assigned to: ${taskName}`,
    }),

    advancingApproved: (category: string) => ({
      type: 'ADVANCING_APPROVED',
      title: 'Advancing Request Approved',
      message: `Your ${category} advancing request has been approved.`,
    }),

    advancingRejected: (category: string) => ({
      type: 'ADVANCING_REJECTED',
      title: 'Advancing Request Rejected',
      message: `Your ${category} advancing request has been rejected.`,
    }),

    expenseApproved: (amount: number) => ({
      type: 'EXPENSE_APPROVED',
      title: 'Expense Approved',
      message: `Your expense of $${amount} has been approved.`,
    }),

    budgetAlert: (projectName: string, percentage: number) => ({
      type: 'BUDGET_ALERT',
      title: 'Budget Alert',
      message: `${projectName} has used ${percentage}% of its budget.`,
    }),
  };
}
