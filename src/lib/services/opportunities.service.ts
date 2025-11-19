import { prisma } from '@/lib/prisma';

/**
 * OpportunitiesService
 * Business logic for /opportunities
 */

export class OpportunitiesService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.opportunity.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.opportunity.findUnique({ where: { id: params } });
    }
    return await prisma.opportunity.findUnique(params);
  }

  async create(data: any) {
    return await prisma.opportunity.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.opportunity.update({ where: { id: params }, data: data! });
    }
    return await prisma.opportunity.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.opportunity.delete({ where: { id: params } });
    }
    return await prisma.opportunity.delete(params);
  }
}
