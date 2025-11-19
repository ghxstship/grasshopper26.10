import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';

/**
 * LogoutService
 * Business logic for /auth/logout
 */

export class LogoutService extends BaseService {
  async findSessionByToken(sessionToken: string) {
    return await prisma.session.findUnique({
      where: { sessionToken },
    });
  }

  async deleteSession(sessionToken: string) {
    return await prisma.session.delete({
      where: { sessionToken },
    });
  }

  async deleteUserSessions(userId: string) {
    return await prisma.session.deleteMany({
      where: { userId },
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
