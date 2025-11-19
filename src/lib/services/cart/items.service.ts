import { prisma } from '@/lib/prisma';

/**
 * ItemsService
 * Business logic for /cart/items
 */

export class CartService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.cartItem.findMany(filters);
  }

  async findById(params: any) {
    // Check if looking for cart or product based on where clause
    if (params.where?.userId) {
      return await prisma.cart.findFirst(params);
    }
    return await prisma.product.findUnique(params);
  }

  async create(data: any) {
    // Check if creating cart or cart item based on data structure
    if (data.data?.userId && !data.data?.cartId) {
      return await prisma.cart.create(data);
    }
    return await prisma.cartItem.create(data);
  }

  async update(params: any) {
    return await prisma.cartItem.update(params);
  }

  async delete(params: any) {
    return await prisma.cartItem.delete(params);
  }
}
