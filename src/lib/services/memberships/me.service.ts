import { prisma } from '@/lib/prisma';

/**
 * MeService
 * Business logic for /memberships/me
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

  async create(params: any) {
    if (params.data) {
      return await prisma.membership.create(params);
    }
    return await prisma.membership.create({ data: params });
  }

  async update(params: string | { where: { id: string }; data: any; include?: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.membership.update({ where: { id: params }, data: data! });
    }
    return await prisma.membership.update(params as any);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.membership.delete({ where: { id: params } });
    }
    return await prisma.membership.delete(params);
  }
}
