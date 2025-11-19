import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';
import bcrypt from 'bcryptjs';

/**
 * RegisterService
 * Business logic for /auth/register
 */

export class RegisterService extends BaseService {
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async createUser(data: {
    email: string;
    password: string;
    name?: string;
  }) {
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });
  }

  async createVerificationToken(userId: string, token: string) {
    return await prisma.emailVerificationToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });
  }
}
