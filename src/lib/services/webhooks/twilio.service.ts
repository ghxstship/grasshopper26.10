import { BaseService } from '../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * WebhooksService
 * Business logic for webhook operations
 */

export class WebhooksService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.notification.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.notification.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.notification.create({ data });
  }

  async createMany(data: any) {
    return await prisma.notification.createMany(data);
  }

  async update(id: string, data: any) {
    return await prisma.notification.update({ where: { id }, data });
  }

  async updateMany(params: any) {
    return await prisma.notification.updateMany(params);
  }

  async delete(id: string) {
    return await prisma.notification.delete({ where: { id } });
  }

  async deleteMany(params: any) {
    return await prisma.notification.deleteMany(params);
  }
}
