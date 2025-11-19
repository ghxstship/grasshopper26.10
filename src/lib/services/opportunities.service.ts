import { prisma } from '@/lib/prisma';

/**
 * OpportunitiesService
 * Business logic for /opportunities
 */

export class OpportunitiesService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.opportunities.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.opportunities.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.opportunities.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.opportunities.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.opportunities.delete({ where: { id } });
  }
}
