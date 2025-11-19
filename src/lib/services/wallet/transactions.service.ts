import { prisma } from '@/lib/prisma';

/**
 * TransactionsService
 * Business logic for /wallet/transactions
 */

export class WalletService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.walletTransaction.findMany(filters);
  }

  async findById(params: string | { where: any; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.walletTransaction.findUnique({ where: { id: params } });
    }
    return await prisma.walletTransaction.findUnique(params as any);
  }

  async create(params: any) {
    if (params.data) {
      return await prisma.walletTransaction.create(params);
    }
    return await prisma.walletTransaction.create({ data: params });
  }

  async update(params: string | { where: any; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.walletTransaction.update({ where: { id: params }, data: data! });
    }
    return await prisma.walletTransaction.update(params as any);
  }

  async delete(params: string | { where: any }) {
    if (typeof params === 'string') {
      return await prisma.walletTransaction.delete({ where: { id: params } });
    }
    return await prisma.walletTransaction.delete(params as any);
  }
}
