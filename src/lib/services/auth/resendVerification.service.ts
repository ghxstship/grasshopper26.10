import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';
import crypto from 'crypto';

/**
 * ResendVerificationService
 * Business logic for /auth/resend-verification
 */

export class ResendVerificationService extends BaseService {
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async deleteExistingTokens(userId: string) {
    return await prisma.emailVerificationToken.deleteMany({
      where: { userId },
    });
  }

  async createVerificationToken(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    return await prisma.emailVerificationToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }
}
