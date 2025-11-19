import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';

/**
 * VerifyEmailService
 * Business logic for /auth/verify-email
 */

export class VerifyEmailService extends BaseService {
  async findValidVerificationToken(token: string) {
    return await prisma.emailVerificationToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });
  }

  async verifyUserEmail(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: new Date(),
      },
    });
  }

  async deleteVerificationToken(token: string) {
    return await prisma.emailVerificationToken.deleteMany({
      where: { token },
    });
  }

  async deleteUserVerificationTokens(userId: string) {
    return await prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });
  }
}
