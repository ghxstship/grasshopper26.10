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

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.account.findUnique({ where: { id: params } });
    }
    return await prisma.account.findUnique(params);
  }

  async create(data: any) {
    return await prisma.account.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.account.update({ where: { id: params }, data: data! });
    }
    return await prisma.account.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.account.delete({ where: { id: params } });
    }
    return await prisma.account.delete(params);
  }
}
