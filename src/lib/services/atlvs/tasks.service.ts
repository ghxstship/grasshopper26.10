import { prisma } from '@/lib/prisma';

export class AtlvsService {
  async findMany(params: any) {
    return prisma.task.findMany(params);
  }

  async count(params: any) {
    return prisma.task.count(params);
  }

  async create(params: any) {
    return prisma.task.create(params);
  }

  async execute(data: any) {
    return data;
  }
}
