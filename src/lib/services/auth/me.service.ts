import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';

/**
 * MeService
 * Business logic for /auth/me
 */

export class MeService extends BaseService {
  async findUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
        sessions: {
          where: {
            expires: {
              gt: new Date(),
            },
          },
        },
        organizations: {
          include: {
            organization: true,
          },
        },
        notificationPreferences: true,
      },
    });
  }

  async updateUser(userId: string, data: {
    name?: string;
    bio?: string;
    image?: string;
  }) {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getUserStats(userId: string) {
    const [ticketCount, orderCount, wishlistCount] = await Promise.all([
      prisma.ticket.count({ where: { userId } }),
      prisma.order.count({ where: { userId } }),
      prisma.wishlist.count({ where: { userId } }),
    ]);

    return {
      ticketCount,
      orderCount,
      wishlistCount,
    };
  }
}
