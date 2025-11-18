/**
 * Notification Service
 * Handles user notifications across all platforms
 */

import { BaseService, ServiceResult } from '../base/BaseService';
import { Prisma } from '@prisma/client';

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export class NotificationService extends BaseService {
  /**
   * Create a notification
   */
  async create(input: CreateNotificationInput): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const notification = await this.prisma.notification.create({
        data: {
          userId: input.userId,
          title: input.title,
          message: input.message,
          type: input.type,
          actionUrl: input.actionUrl,
          metadata: input.metadata as Prisma.InputJsonValue,
          read: false,
        },
      });

      // Send real-time notification via Supabase Realtime
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        await supabase.channel('notifications').send({
          type: 'broadcast',
          event: 'notification:new',
          payload: {
            userId: input.userId,
            notification: {
              id: notification.id,
              type: input.type,
              title: input.title,
              message: input.message,
              createdAt: notification.createdAt,
            },
          },
        });
      } catch (error) {
        console.error('Failed to send realtime notification:', error);
      }

      // Send push notification if user has enabled it
      try {
        // Check user preferences for push notifications
        const prefs = await this.prisma.notificationPreferences.findUnique({
          where: { userId: input.userId },
        });
        
        const pushEnabled = prefs?.push !== false; // Default to enabled if no preferences set
        
        if (pushEnabled) {
          // Push notification would be sent here via service like Firebase
          // For now, log that it would be sent
          console.log('Push notification queued for user:', input.userId);
        }
      } catch (error) {
        console.error('Failed to check push notification settings:', error);
      }

      return notification;
    }, 'create');
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(userId: string, unreadOnly = false): Promise<ServiceResult<unknown[]>> {
    return this.execute(async () => {
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId,
          ...(unreadOnly && { read: false }),
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      });

      return notifications;
    }, 'getUserNotifications');
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string, userId: string): Promise<ServiceResult<unknown>> {
    return this.execute(async () => {
      const notification = await this.prisma.notification.update({
        where: {
          id,
          userId, // Ensure user owns this notification
        },
        data: {
          read: true,
        },
      });

      return notification;
    }, 'markAsRead');
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      await this.prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: {
          read: true,
        },
      });
    }, 'markAllAsRead');
  }

  /**
   * Delete notification
   */
  async delete(id: string, userId: string): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      await this.prisma.notification.delete({
        where: {
          id,
          userId, // Ensure user owns this notification
        },
      });
    }, 'delete');
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<ServiceResult<number>> {
    return this.execute(async () => {
      const count = await this.prisma.notification.count({
        where: {
          userId,
          read: false,
        },
      });

      return count;
    }, 'getUnreadCount');
  }

  /**
   * Send notification to multiple users
   */
  async sendBulk(userIds: string[], notification: Omit<CreateNotificationInput, 'userId'>): Promise<ServiceResult<void>> {
    return this.execute(async () => {
      await this.prisma.notification.createMany({
        data: userIds.map(userId => ({
          userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          actionUrl: notification.actionUrl,
          metadata: notification.metadata as Prisma.InputJsonValue,
          read: false,
        })),
      });

      // Send real-time notifications via Supabase Realtime
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const createdNotifications = await this.prisma.notification.findMany({
          where: {
            userId: { in: userIds },
            createdAt: { gte: new Date(Date.now() - 1000) },
          },
        });

        for (const notif of createdNotifications) {
          await supabase.channel('notifications').send({
            type: 'broadcast',
            event: 'notification:new',
            payload: {
              userId: notif.userId,
              notification: {
                id: notif.id,
                type: notif.type,
                title: notif.title,
                message: notif.message,
                createdAt: notif.createdAt,
              },
            },
          });
        }
      } catch (error) {
        console.error('Failed to send bulk realtime notifications:', error);
      }
    }, 'sendBulk');
  }
}
