import { prisma } from '@/lib/prisma';

/**
 * TransferService
 * Business logic for /tickets/:id/transfer
 */

export class TicketsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.ticket.findMany(filters);
  }

  async findById(params: string | { where: any; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.user.findUnique({ where: { id: params } });
    }
    return await prisma.user.findUnique(params as any);
  }

  async create(data: any) {
    return await prisma.ticket.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.ticket.update({ where: { id: params }, data: data! });
    }
    return await prisma.ticket.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.ticket.delete({ where: { id: params } });
    }
    return await prisma.ticket.delete(params);
  }
}
