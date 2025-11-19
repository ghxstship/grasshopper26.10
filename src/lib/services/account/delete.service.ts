import { prisma } from '@/lib/prisma';

/**
 * AccountService
 * Business logic for /account/delete
 */

export class AccountService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.account.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.account.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.account.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.account.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.account.delete({ where: { id } });
  }
}
