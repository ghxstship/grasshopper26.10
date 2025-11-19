import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';

/**
 * RefreshService
 * Business logic for /auth/refresh
 */

export class RefreshService extends BaseService {
  async findSessionByToken(sessionToken: string) {
    return await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: true,
      },
    });
  }

  async updateSession(sessionToken: string, expiresAt: Date) {
    return await prisma.session.update({
      where: { sessionToken },
      data: {
        expires: expiresAt,
      },
    });
  }

  async deleteExpiredSessions() {
    return await prisma.session.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
  }
}
