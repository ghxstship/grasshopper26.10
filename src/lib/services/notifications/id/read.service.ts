import { prisma } from '@/lib/prisma';

/**
 * ReadService
 * Business logic for /notifications/:id/read
 */

export class NotificationsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.notifications.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.notifications.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.notifications.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.notifications.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.notifications.delete({ where: { id } });
  }
}
