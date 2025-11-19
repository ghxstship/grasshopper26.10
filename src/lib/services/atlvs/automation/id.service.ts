import { prisma } from '@/lib/prisma';

export class AtlvsService {
  async findById(params: { where: { id: string } }) {
    return prisma.automation.findUnique({
      where: params.where,
    });
  }

  async update(params: { where: { id: string }; data: any }) {
    return prisma.automation.update(params);
  }

  async delete(params: { where: { id: string } }) {
    return prisma.automation.delete(params);
  }

  async execute(data: any) {
    return data;
  }

  async findAll(params: { where?: { id: string }; take?: number; skip?: number }) {
    return prisma.automation.findMany({
      where: params.where,
      take: params.take,
      skip: params.skip,
    });
  }

  async create(params: { data: any }) {
    return prisma.automation.create(params);
  }
}
