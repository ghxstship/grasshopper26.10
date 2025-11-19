import { prisma } from '@/lib/prisma';

/**
 * [id]Service
 * Business logic for /products/:id
 */

export class ProductsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.product.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.product.findUnique({ where: { id: params } });
    }
    return await prisma.product.findUnique(params);
  }

  async create(data: any) {
    return await prisma.product.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.product.update({ where: { id: params }, data: data! });
    }
    return await prisma.product.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.product.delete({ where: { id: params } });
    }
    return await prisma.product.delete(params);
  }
}
