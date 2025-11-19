import { BaseService } from '../../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * WebhooksService
 * Business logic for webhook operations
 */

export class WebhooksService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.advancingRequest.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.advancingRequest.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.advancingRequest.create({ data });
  }

  async createMany(data: any) {
    return await prisma.advancingRequest.createMany(data);
  }

  async update(id: string, data: any) {
    return await prisma.advancingRequest.update({ where: { id }, data });
  }

  async updateMany(params: any) {
    return await prisma.advancingRequest.updateMany(params);
  }

  async delete(id: string) {
    return await prisma.advancingRequest.delete({ where: { id } });
  }

  async deleteMany(params: any) {
    return await prisma.advancingRequest.deleteMany(params);
  }
}
