import { prisma } from '@/lib/prisma';

/**
 * [id]Service
 * Business logic for /wishlists/:id
 */

export class WishlistsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.wishlist.findMany(filters);
  }

  async findById(params: string | { where: any; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.wishlist.findUnique({ where: { id: params } });
    }
    return await prisma.wishlist.findUnique(params as any);
  }

  async create(params: any) {
    if (params.data) {
      return await prisma.wishlist.create(params);
    }
    return await prisma.wishlist.create({ data: params });
  }

  async update(params: string | { where: any; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.wishlist.update({ where: { id: params }, data: data! });
    }
    return await prisma.wishlist.update(params as any);
  }

  async delete(params: string | { where: any }) {
    if (typeof params === 'string') {
      return await prisma.wishlist.delete({ where: { id: params } });
    }
    return await prisma.wishlist.delete(params as any);
  }
}
