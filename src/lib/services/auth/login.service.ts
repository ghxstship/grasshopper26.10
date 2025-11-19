import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';
import bcrypt from 'bcryptjs';

/**
 * LoginService
 * Business logic for /auth/login
 */

export class LoginService extends BaseService {
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });
  }

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
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
}
