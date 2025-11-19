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

  async findById(id: string) {
    return await prisma.wallet.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.wallet.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.wallet.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.wallet.delete({ where: { id } });
  }
}
