import { prisma } from '@/lib/prisma';

/**
 * CancelService
 * Business logic for /memberships/cancel
 */

export class MembershipsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.membership.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.membership.findUnique({ where: { id: params } });
    }
    return await prisma.membership.findUnique(params);
  }

  async create(data: any) {
    return await prisma.membership.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.membership.update({ where: { id: params }, data: data! });
    }
    return await prisma.membership.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.membership.delete({ where: { id: params } });
    }
    return await prisma.membership.delete(params);
  }
}
