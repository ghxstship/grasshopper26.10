import { prisma } from '@/lib/prisma';

/**
 * PaymentService
 * Business logic for /crypto/payment
 */

export class CryptoService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.crypto.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.crypto.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.crypto.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.crypto.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.crypto.delete({ where: { id } });
  }
}
