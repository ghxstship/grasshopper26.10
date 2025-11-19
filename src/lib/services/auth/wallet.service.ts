import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';

/**
 * AuthWalletService
 * Business logic for /auth/wallet
 */

export class AuthWalletService extends BaseService {
  async findUserWallet(userId: string) {
    return await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });
  }

  async createWallet(userId: string) {
    return await prisma.wallet.create({
      data: {
        userId,
        balance: 0,
      },
    });
  }

  async updateWalletBalance(userId: string, amount: number) {
    return await prisma.wallet.update({
      where: { userId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }
}
