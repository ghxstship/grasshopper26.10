import { prisma } from '@/lib/prisma';

/**
 * MintService
 * Business logic for /nft/mint
 */

export class NftService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.nft.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.nft.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.nft.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.nft.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.nft.delete({ where: { id } });
  }
}
