import { prisma } from '@/lib/prisma';

/**
 * MarkAllReadService
 * Business logic for /notifications/mark-all-read
 */

export class NotificationsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.notification.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.notification.findUnique({ where: { id: params } });
    }
    return await prisma.notification.findUnique(params);
  }

  async create(data: any) {
    return await prisma.notification.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.notification.update({ where: { id: params }, data: data! });
    }
    return await prisma.notification.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.notification.delete({ where: { id: params } });
    }
    return await prisma.notification.delete(params);
  }

  async updateMany(params: { where: any; data: any }) {
    return await prisma.notification.updateMany(params);
  }
}
