import { prisma } from '@/lib/prisma';

/**
 * PaymentService
 * Business logic for /crypto/payment
 */

export class CryptoService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.cryptoWallet.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.cryptoWallet.findUnique({ where: { id: params } });
    }
    return await prisma.cryptoWallet.findUnique(params);
  }

  async create(data: any) {
    return await prisma.cryptoWallet.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.cryptoWallet.update({ where: { id: params }, data: data! });
    }
    return await prisma.cryptoWallet.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.cryptoWallet.delete({ where: { id: params } });
    }
    return await prisma.cryptoWallet.delete(params);
  }
}
