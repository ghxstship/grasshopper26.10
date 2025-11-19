import { BaseService } from '../../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * WebhooksService
 * Business logic for webhook operations
 */

export class WebhooksService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.ticket.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.ticket.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.ticket.create({ data });
  }

  async createMany(data: any) {
    return await prisma.ticket.createMany(data);
  }

  async update(id: string, data: any) {
    return await prisma.ticket.update({ where: { id }, data });
  }

  async updateMany(params: any) {
    return await prisma.ticket.updateMany(params);
  }

  async delete(id: string) {
    return await prisma.ticket.delete({ where: { id } });
  }

  async deleteMany(params: any) {
    return await prisma.ticket.deleteMany(params);
  }
}
