import { prisma } from '@/lib/prisma';

/**
 * DepositService
 * Business logic for /wallet/deposit
 */

export class WalletService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.wallet.findMany(filters);
  }

  async findById(params: string | { where: any; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.wallet.findUnique({ where: { id: params } });
    }
    return await prisma.wallet.findUnique(params as any);
  }

  async create(params: any) {
    if (params.data) {
      return await prisma.wallet.create(params);
    }
    return await prisma.wallet.create({ data: params });
  }

  async update(params: string | { where: any; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.wallet.update({ where: { id: params }, data: data! });
    }
    return await prisma.wallet.update(params as any);
  }

  async delete(params: string | { where: any }) {
    if (typeof params === 'string') {
      return await prisma.wallet.delete({ where: { id: params } });
    }
    return await prisma.wallet.delete(params as any);
  }
}
