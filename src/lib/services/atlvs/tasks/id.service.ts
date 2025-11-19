import { prisma } from '@/lib/prisma';

export class AtlvsService {
  async findById(params: any) {
    return prisma.task.findUnique(params);
  }

  async update(params: any) {
    return prisma.task.update(params);
  }

  async delete(params: any) {
    return prisma.task.delete(params);
  }

  async execute(data: any) {
    return data;
  }
}
