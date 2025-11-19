import { BaseService } from '../../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * WebhooksService
 * Business logic for webhook operations
 */

export class WebhooksService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.task.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.task.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.task.create({ data });
  }

  async createMany(data: any) {
    return await prisma.task.createMany(data);
  }

  async update(id: string, data: any) {
    return await prisma.task.update({ where: { id }, data });
  }

  async updateMany(params: any) {
    return await prisma.task.updateMany(params);
  }

  async delete(id: string) {
    return await prisma.task.delete({ where: { id } });
  }

  async deleteMany(params: any) {
    return await prisma.task.deleteMany(params);
  }
}
