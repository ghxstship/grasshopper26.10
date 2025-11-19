import { prisma } from '@/lib/prisma';

export class AtlvsService {
  async findById(params: any) {
    return prisma.project.findUnique(params);
  }

  async update(params: any) {
    return prisma.project.update(params);
  }

  async delete(params: any) {
    return prisma.project.delete(params);
  }

  async execute(data: any) {
    return data;
  }
}
