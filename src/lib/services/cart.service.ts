import { prisma } from '@/lib/prisma';

/**
 * CartService
 * Business logic for /cart
 */

export class CartService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.cart.findMany(filters);
  }

  async findById(params: any) {
    return await prisma.cart.findFirst(params);
  }

  async create(data: any) {
    return await prisma.cart.create({ data });
  }

  async update(params: any) {
    return await prisma.cart.update(params);
  }

  async delete(params: any) {
    return await prisma.cart.delete(params);
  }
}
