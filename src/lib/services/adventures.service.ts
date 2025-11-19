import { prisma } from '@/lib/prisma';

/**
 * AdventuresService
 * Business logic for /adventures
 */

export class AdventuresService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.adventures.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.adventures.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.adventures.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.adventures.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.adventures.delete({ where: { id } });
  }
}
