import { prisma } from '@/lib/prisma';

/**
 * DestinationsService
 * Business logic for /destinations
 */

export class DestinationsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.venue.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.venue.findUnique({ where: { id: params } });
    }
    return await prisma.venue.findUnique(params);
  }

  async create(data: any) {
    return await prisma.venue.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.venue.update({ where: { id: params }, data: data! });
    }
    return await prisma.venue.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.venue.delete({ where: { id: params } });
    }
    return await prisma.venue.delete(params);
  }
}
