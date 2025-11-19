import { prisma } from '@/lib/prisma';

/**
 * AlertsService
 * Business logic for /alerts
 */

export class AlertsService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.alerts.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.alerts.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.alerts.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.alerts.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.alerts.delete({ where: { id } });
  }
}
