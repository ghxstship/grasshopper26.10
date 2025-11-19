import { prisma } from '@/lib/prisma';

/**
 * AlertsService
 * Business logic for /alerts
 */

export class AlertsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.alert.findMany(filters);
  }

  async findById(params: string | { where: { id: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.alert.findUnique({ where: { id: params } });
    }
    return await prisma.alert.findUnique(params);
  }

  async create(data: any) {
    return await prisma.alert.create({ data });
  }

  async update(params: string | { where: { id: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.alert.update({ where: { id: params }, data: data! });
    }
    return await prisma.alert.update(params);
  }

  async delete(params: string | { where: { id: string } }) {
    if (typeof params === 'string') {
      return await prisma.alert.delete({ where: { id: params } });
    }
    return await prisma.alert.delete(params);
  }
}
