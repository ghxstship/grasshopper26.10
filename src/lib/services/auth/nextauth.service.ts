import { prisma } from '@/lib/prisma';
import { BaseService } from '../base/BaseService';

/**
 * NextAuthService
 * Business logic for /auth/[...nextauth]
 * Handles NextAuth.js integration
 */

export class NextAuthService extends BaseService {
  async findUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
        sessions: true,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findAccount(provider: string, providerAccountId: string) {
    return await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
    });
  }

  async createAccount(data: {
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
  }) {
    return await prisma.account.create({ data });
  }
}
