import { prisma } from '@/lib/prisma';

/**
 * [id]Service
 * Business logic for /artists/:id
 */

export class ArtistsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.artists.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.artists.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.artists.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.artists.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.artists.delete({ where: { id } });
  }
}
