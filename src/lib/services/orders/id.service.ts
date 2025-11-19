import { prisma } from '@/lib/prisma';

/**
 * [id]Service
 * Business logic for /orders/:id
 */

export class OrdersService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.order.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.order.findUnique({ where: { id: params } });
    }
    return await prisma.order.findUnique(params);
  }

  async create(data: any) {
    return await prisma.order.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any; include?: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.order.update({ where: { id: params }, data: data! });
    }
    return await prisma.order.update(params as any);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.order.delete({ where: { id: params } });
    }
    return await prisma.order.delete(params);
  }
}
