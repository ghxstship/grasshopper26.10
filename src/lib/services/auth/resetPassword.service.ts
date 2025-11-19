import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';
import bcrypt from 'bcryptjs';

/**
 * ResetPasswordService
 * Business logic for /auth/reset-password
 */

export class ResetPasswordService extends BaseService {
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

  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    return await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }

  async deleteResetToken(token: string) {
    return await prisma.passwordResetToken.deleteMany({
      where: { token },
    });
  }

  async deleteUserResetTokens(userId: string) {
    return await prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }
}
