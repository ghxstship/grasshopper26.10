import { BaseService } from './base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * MarketplaceService
 * Business logic for /marketplace
 * Handles marketplace product listings
 */

export class MarketplaceService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.product.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        cartItems: true,
        organization: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        cartItems: true,
        organization: true,
      },
    });
  }

  async create(params: any) {
    if (params.data) {
      const data = params.data;
      const slug = data.slug || this.generateSlug(data.name);
      
      return await prisma.product.create({
        data: {
          ...data,
          slug,
          stock: data.stock || 0,
        },
      });
    }
    
    // Legacy support for direct data object
    const slug = params.slug || this.generateSlug(params.name);
    return await prisma.product.create({
      data: {
        ...params,
        slug,
        stock: params.stock || 0,
      },
    });
  }

  async update(id: string, data: any) {
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

  async updateStock(id: string, quantity: number) {
    return await prisma.product.update({
      where: { id },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });
  }

  async searchProducts(query: string, limit = 20) {
    return await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
