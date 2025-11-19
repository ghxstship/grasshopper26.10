import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';

/**
 * RefreshTokenService
 * Business logic for /auth/refresh-token
 */

export class RefreshTokenService extends BaseService {
  async findSessionByToken(sessionToken: string) {
    return await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: true,
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
}
