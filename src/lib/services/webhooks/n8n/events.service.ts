import { BaseService } from '../../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * WebhooksService
 * Business logic for webhook operations
 */

export class WebhooksService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.event.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.event.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.event.create({ data });
  }

  async createMany(data: any) {
    return await prisma.event.createMany(data);
  }

  async update(id: string, data: any) {
    return await prisma.event.update({ where: { id }, data });
  }

  async updateMany(params: any) {
    return await prisma.event.updateMany(params);
  }

  async delete(id: string) {
    return await prisma.event.delete({ where: { id } });
  }

  async deleteMany(params: any) {
    return await prisma.event.deleteMany(params);
  }
}
