import { prisma } from '@/lib/prisma';

/**
 * ItemsService
 * Business logic for /cart/items
 */

export class CartService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.cart.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.cart.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.cart.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.cart.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.cart.delete({ where: { id } });
  }
}
