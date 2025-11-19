import { prisma } from '@/lib/prisma';

/**
 * AdventuresService
 * Business logic for /adventures
 */

export class AdventuresService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.adventure.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.adventure.findUnique({ where: { id: params } });
    }
    return await prisma.adventure.findUnique(params);
  }

  async create(data: any) {
    return await prisma.adventure.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.adventure.update({ where: { id: params }, data: data! });
    }
    return await prisma.adventure.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.adventure.delete({ where: { id: params } });
    }
    return await prisma.adventure.delete(params);
  }
}
