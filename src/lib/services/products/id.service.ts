import { prisma } from '@/lib/prisma';

/**
 * [id]Service
 * Business logic for /products/:id
 */

export class ProductsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.products.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.products.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.products.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.products.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.products.delete({ where: { id } });
  }
}
