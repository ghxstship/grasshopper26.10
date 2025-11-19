import { prisma } from '@/lib/prisma';

/**
 * ArtistsService
 * Business logic for /events/:id/artists
 */

export class EventsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.eventArtist.findMany(filters);
  }

  async findById(params: string | { where: any; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.eventArtist.findUnique({ where: { id: params } });
    }
    return await prisma.eventArtist.findUnique(params as any);
  }

  async create(data: any) {
    return await prisma.eventArtist.create({ data });
  }

  async update(params: string | { where: any; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.eventArtist.update({ where: { id: params }, data: data! });
    }
    return await prisma.eventArtist.update(params as any);
  }

  async delete(params: string | { where: any }) {
    if (typeof params === 'string') {
      return await prisma.eventArtist.delete({ where: { id: params } });
    }
    return await prisma.eventArtist.delete(params as any);
  }
}
