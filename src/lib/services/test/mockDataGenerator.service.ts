import { prisma } from '@/lib/prisma';

/**
 * MockDataGeneratorService
 * Business logic for /test/mock-data-generator
 */

export class TestService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.user.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.user.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.user.delete({ where: { id } });
  }
}
