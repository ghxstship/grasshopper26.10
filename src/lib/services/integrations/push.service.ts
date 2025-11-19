import { BaseService } from '../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * IntegrationsService
 * Business logic for /integrations/push
 * Handles push notification integrations using NotificationPreferences
 */

export class IntegrationsService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.notificationPreferences.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.notificationPreferences.findUnique({ where: { id: params } });
    }
    return await prisma.notificationPreferences.findUnique(params);
  }

  async findByUserId(userId: string) {
    return await prisma.notificationPreferences.findUnique({
      where: { userId },
    });
  }

  async create(data: any) {
    return await prisma.notificationPreferences.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.notificationPreferences.update({ where: { id: params }, data: data! });
    }
    return await prisma.notificationPreferences.update(params);
  }

  async updateByUserId(userId: string, data: any) {
    return await prisma.notificationPreferences.update({
      where: { userId },
      data,
    });
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.notificationPreferences.delete({ where: { id: params } });
    }
    return await prisma.notificationPreferences.delete(params);
  }

  async sendPushNotification(userId: string, notification: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
  }) {
    // Create notification record
    return await prisma.notification.create({
      data: {
        userId,
        title: notification.title,
        message: notification.body,
        type: 'PUSH',
        read: false,
      },
    });
  }
}
