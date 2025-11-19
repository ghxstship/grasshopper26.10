import { BaseService } from '../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * MarketplaceIdService
 * Business logic for /marketplace/:id
 * Handles individual marketplace product operations
 */

export class MarketplaceIdService extends BaseService {
  async findById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        cartItems: {
          include: {
            cart: {
              select: {
                id: true,
                userId: true,
              },
            },
          },
        },
        organization: true,
      },
    });
  }

  async update(id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    stock?: number;
  }) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.product.delete({ where: { id: params } });
    }
    return await prisma.product.delete(params);
  }

  async incrementStock(id: string, amount: number) {
    return await prisma.product.update({
      where: { id },
      data: {
        stock: {
          increment: amount,
        },
      },
    });
  }

  async decrementStock(id: string, amount: number) {
    return await prisma.product.update({
      where: { id },
      data: {
        stock: {
          decrement: amount,
        },
      },
    });
  }
}
