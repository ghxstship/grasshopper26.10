import { prisma } from '@/lib/prisma';

/**
 * CommentsService
 * Business logic for /social/posts/:id/comments
 */

export class SocialService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.socialPost.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.socialPost.findUnique({ where: { id: params } });
    }
    return await prisma.socialPost.findUnique(params);
  }

  async create(data: any) {
    return await prisma.socialPost.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.socialPost.update({ where: { id: params }, data: data! });
    }
    return await prisma.socialPost.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.socialPost.delete({ where: { id: params } });
    }
    return await prisma.socialPost.delete(params);
  }
}
