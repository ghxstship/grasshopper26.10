import { prisma } from '@/lib/prisma';

export class AtlvsService {
  async findById(params: { where: { id: string } }) {
    return prisma.automation.findUnique({
      where: params.where,
    });
  }

  async create(params: { data: any }) {
    return prisma.automationExecution.create(params);
  }

  async update(params: { where: { id: string }; data: any }) {
    return prisma.automationExecution.update(params);
  }

  async execute(data: any) {
    return data;
  }
}
