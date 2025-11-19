import { prisma } from '@/lib/prisma';

export class AtlvsService {
  async findMany(params: { where: { automationId: string }; take?: number; skip?: number }) {
    return prisma.automationExecution.findMany({
      where: params.where,
      take: params.take,
      skip: params.skip,
      orderBy: { startedAt: 'desc' },
    });
  }

  async execute(data: any) {
    return data;
  }
}
