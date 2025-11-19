import { prisma } from '@/lib/prisma';

/**
 * VerifyEmailService
 * Business logic for /auth/verify-email
 */

export class AuthService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.auth.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.auth.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.auth.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.auth.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.auth.delete({ where: { id } });
  }
}
