import { prisma } from '@/lib/prisma';

/**
 * AvatarService
 * Business logic for /profile/avatar
 */

export class ProfileService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.user.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.user.findUnique({ where: { id: params } });
    }
    return await prisma.user.findUnique(params);
  }

  async create(data: any) {
    return await prisma.user.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any; select?: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.user.update({ where: { id: params }, data: data! });
    }
    return await prisma.user.update(params as any);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.user.delete({ where: { id: params } });
    }
    return await prisma.user.delete(params);
  }
}
