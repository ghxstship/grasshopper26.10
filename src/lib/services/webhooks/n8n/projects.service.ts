import { BaseService } from '../../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * WebhooksService
 * Business logic for webhook operations
 */

export class WebhooksService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.project.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.project.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.project.create({ data });
  }

  async createMany(data: any) {
    return await prisma.project.createMany(data);
  }

  async update(id: string, data: any) {
    return await prisma.project.update({ where: { id }, data });
  }

  async updateMany(params: any) {
    return await prisma.project.updateMany(params);
  }

  async delete(id: string) {
    return await prisma.project.delete({ where: { id } });
  }

  async deleteMany(params: any) {
    return await prisma.project.deleteMany(params);
  }
}
