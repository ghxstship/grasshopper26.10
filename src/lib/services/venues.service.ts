import { prisma } from '@/lib/prisma';

/**
 * VenuesService
 * Business logic for /venues
 */

export class VenuesService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.venues.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.venues.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.venues.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.venues.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.venues.delete({ where: { id } });
  }
}
