import { prisma } from '@/lib/prisma';

/**
 * FollowService
 * Business logic for /social/follow
 */

export class SocialService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.follow.findMany(filters);
  }

  async findById(params: string | { where: any; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.follow.findUnique({ where: { id: params } });
    }
    return await prisma.follow.findUnique(params as any);
  }

  async create(params: any) {
    if (params.data) {
      return await prisma.follow.create(params);
    }
    return await prisma.follow.create({ data: params });
  }

  async update(params: string | { where: any; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.follow.update({ where: { id: params }, data: data! });
    }
    return await prisma.follow.update(params as any);
  }

  async delete(params: string | { where: any }) {
    if (typeof params === 'string') {
      return await prisma.follow.delete({ where: { id: params } });
    }
    return await prisma.follow.delete(params as any);
  }
}
