import { prisma } from '@/lib/prisma';

/**
 * [id]Service
 * Business logic for /tickets/:id
 */

export class TicketsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.tickets.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.tickets.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.tickets.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.tickets.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.tickets.delete({ where: { id } });
  }
}
