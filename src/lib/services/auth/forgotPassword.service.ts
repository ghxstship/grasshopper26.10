import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';
import crypto from 'crypto';

/**
 * ForgotPasswordService
 * Business logic for /auth/forgot-password
 */

export class ForgotPasswordService extends BaseService {
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async createPasswordResetToken(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId },
    });

    // Create new token
    await prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return token;
  }

  async findValidResetToken(token: string) {
    return await prisma.passwordResetToken.findFirst({
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

  async deleteResetToken(token: string) {
    return await prisma.passwordResetToken.deleteMany({
      where: { token },
    });
  }
}
