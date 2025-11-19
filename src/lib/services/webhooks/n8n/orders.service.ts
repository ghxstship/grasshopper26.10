import { BaseService } from '../../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * WebhooksService
 * Business logic for webhook operations
 */

export class WebhooksService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.order.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.order.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.order.create({ data });
  }

  async createMany(data: any) {
    return await prisma.order.createMany(data);
  }

  async update(id: string, data: any) {
    return await prisma.order.update({ where: { id }, data });
  }

  async updateMany(params: any) {
    return await prisma.order.updateMany(params);
  }

  async delete(id: string) {
    return await prisma.order.delete({ where: { id } });
  }

  async deleteMany(params: any) {
    return await prisma.order.deleteMany(params);
  }
}
