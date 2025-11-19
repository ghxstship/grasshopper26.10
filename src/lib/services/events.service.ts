import { prisma } from '@/lib/prisma';

/**
 * EventsService
 * Business logic for /events
 */

export class EventsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.events.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.events.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.events.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.events.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.events.delete({ where: { id } });
  }
}
