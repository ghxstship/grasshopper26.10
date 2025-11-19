import { prisma } from '@/lib/prisma';

/**
 * ArtistsService
 * Business logic for /artists
 */

export class ArtistsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.artist.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.artist.findUnique({ where: { id: params } });
    }
    return await prisma.artist.findUnique(params);
  }

  async create(data: any) {
    return await prisma.artist.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.artist.update({ where: { id: params }, data: data! });
    }
    return await prisma.artist.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.artist.delete({ where: { id: params } });
    }
    return await prisma.artist.delete(params);
  }
}
