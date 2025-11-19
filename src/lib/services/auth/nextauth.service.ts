import { prisma } from '@/lib/prisma';

/**
 * [...nextauth]Service
 * Business logic for /auth/[...nextauth]
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
