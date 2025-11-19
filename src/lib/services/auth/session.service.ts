import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';

/**
 * SessionService
 * Business logic for /auth/session
 */

export class SessionService extends BaseService {
  async findSessionByToken(sessionToken: string) {
    return await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: true,
      },
    });
  }

  async findUserSessions(userId: string) {
    return await prisma.session.findMany({
      where: { userId },
      orderBy: {
        expires: 'desc',
      },
    });
  }

  async createSession(userId: string, sessionToken: string, expiresAt: Date) {
    return await prisma.session.create({
      data: {
        userId,
        sessionToken,
        expires: expiresAt,
      },
    });
  }

  async deleteSession(sessionToken: string) {
    return await prisma.session.delete({
      where: { sessionToken },
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
