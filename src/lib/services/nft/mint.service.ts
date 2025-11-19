import { prisma } from '@/lib/prisma';

/**
 * MintService
 * Business logic for /nft/mint
 */

export class NftService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.nFTTicket.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.nFTTicket.findUnique({ where: { id: params } });
    }
    return await prisma.nFTTicket.findUnique(params);
  }

  async create(data: any) {
    return await prisma.nFTTicket.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.nFTTicket.update({ where: { id: params }, data: data! });
    }
    return await prisma.nFTTicket.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.nFTTicket.delete({ where: { id: params } });
    }
    return await prisma.nFTTicket.delete(params);
  }
}
