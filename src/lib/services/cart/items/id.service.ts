import { prisma } from '@/lib/prisma';

/**
 * [id]Service
 * Business logic for /cart/items/:id
 */

export class CartService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.cartItem.findMany(filters);
  }

  async findById(params: any) {
    return await prisma.cartItem.findUnique(params);
  }

  async create(data: any) {
    return await prisma.cartItem.create({ data });
  }

  async update(params: any) {
    return await prisma.cartItem.update(params);
  }

  async delete(params: any) {
    return await prisma.cartItem.delete(params);
  }
}
