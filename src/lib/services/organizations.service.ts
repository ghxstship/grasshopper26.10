import { prisma } from '@/lib/prisma';

/**
 * OrganizationsService
 * Business logic for /organizations
 */

export class OrganizationsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.organization.findMany(filters);
  }

  async findById(params: string | { where: { id: string } | { slug: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.organization.findUnique({ where: { id: params } });
    }
    return await prisma.organization.findUnique(params as any);
  }

  async create(data: any) {
    return await prisma.organization.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.organization.update({ where: { id: params }, data: data! });
    }
    return await prisma.organization.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.organization.delete({ where: { id: params } });
    }
    return await prisma.organization.delete(params);
  }
}
