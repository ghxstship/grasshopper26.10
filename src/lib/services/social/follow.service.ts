import { prisma } from '@/lib/prisma';

/**
 * FollowService
 * Business logic for /social/follow
 */

export class SocialService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.social.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.social.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.social.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.social.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.social.delete({ where: { id } });
  }
}
