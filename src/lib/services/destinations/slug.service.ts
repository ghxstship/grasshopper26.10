import { prisma } from '@/lib/prisma';

/**
 * [slug]Service
 * Business logic for /destinations/:slug
 */

export class DestinationsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.venue.findMany(filters);
  }

  async findById(params: string | { where: { id: string } | { slug: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.venue.findUnique({ where: { id: params } });
    }
    return await prisma.venue.findUnique(params as any);
  }

  async create(data: any) {
    return await prisma.venue.create({ data });
  }

  async update(params: string | { where: { id: string } | { slug: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.venue.update({ where: { id: params }, data: data! });
    }
    return await prisma.venue.update(params as any);
  }

  async delete(params: string | { where: { id: string } | { slug: string } }) {
    if (typeof params === 'string') {
      return await prisma.venue.delete({ where: { id: params } });
    }
    return await prisma.venue.delete(params as any);
  }
}
