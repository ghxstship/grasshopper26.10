import { prisma } from '@/lib/prisma';

/**
 * OrdersService
 * Business logic for /orders
 */

export class OrdersService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.orders.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.orders.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.orders.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.orders.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.orders.delete({ where: { id } });
  }
}
