import { prisma } from '@/lib/prisma';

/**
 * UsersService
 * Business logic for /search/users
 */

export class UsersService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.search.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.search.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.search.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.search.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.search.delete({ where: { id } });
  }
}
