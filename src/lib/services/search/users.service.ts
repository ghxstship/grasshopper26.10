import { prisma } from '@/lib/prisma';

/**
 * UsersService
 * Business logic for /search/users
 */

export class UsersService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.event.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.event.findUnique({ where: { id: params } });
    }
    return await prisma.event.findUnique(params);
  }

  async create(data: any) {
    return await prisma.event.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.event.update({ where: { id: params }, data: data! });
    }
    return await prisma.event.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.event.delete({ where: { id: params } });
    }
    return await prisma.event.delete(params);
  }
}
