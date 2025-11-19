import { prisma } from '@/lib/prisma';

/**
 * ItemsService
 * Business logic for /wishlists/:id/items
 */

export class WishlistsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.wishlist.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.wishlist.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.wishlist.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.wishlist.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.wishlist.delete({ where: { id } });
  }
}
