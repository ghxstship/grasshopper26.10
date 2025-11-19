import { prisma } from '@/lib/prisma';

/**
 * [slug]Service
 * Business logic for /destinations/:slug
 */

export class DestinationsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.destinations.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.destinations.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.destinations.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.destinations.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.destinations.delete({ where: { id } });
  }
}
