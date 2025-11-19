import { prisma } from '@/lib/prisma';

/**
 * TiersService
 * Business logic for /memberships/tiers
 */

export class MembershipsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.membership.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.membership.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.membership.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.membership.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.membership.delete({ where: { id } });
  }
}
