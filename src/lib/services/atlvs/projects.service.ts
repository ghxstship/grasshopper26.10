import { prisma } from '@/lib/prisma';

export class AtlvsService {
  async findMany(params: any) {
    return prisma.project.findMany(params);
  }

  async count(params: any) {
    return prisma.project.count(params);
  }

  async create(params: any) {
    return prisma.project.create(params);
  }

  async execute(data: any) {
    return data;
  }
}
