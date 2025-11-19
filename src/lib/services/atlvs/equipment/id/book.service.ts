import { prisma } from '@/lib/prisma';

export class AtlvsService {
  async findAll(params: { where: any }) {
    return prisma.equipmentBooking.findMany(params);
  }

  async create(params: any) {
    return prisma.equipmentBooking.create(params);
  }

  async execute(data: any) {
    return data;
  }
}
