import { prisma } from '@/lib/prisma';

/**
 * SettingsService
 * Business logic for /profile/settings
 */

export class ProfileService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.notificationPreferences.findMany(filters);
  }

  async findById(params: string | { where: { id?: string; userId?: string }; include?: any; select?: any }) {
    if (typeof params === 'string') {
      return await prisma.notificationPreferences.findUnique({ where: { id: params } });
    }
    return await prisma.notificationPreferences.findUnique(params as any);
  }

  async create(data: any) {
    return await prisma.notificationPreferences.create({ data });
  }

  async update(params: string | { where: { id?: string; userId?: string }; data: any }, data?: any) {
    if (typeof params === 'string') {
      return await prisma.notificationPreferences.update({ where: { id: params }, data: data! });
    }
    return await prisma.notificationPreferences.update(params as any);
  }

  async delete(params: string | { where: { id?: string; userId?: string } }) {
    if (typeof params === 'string') {
      return await prisma.notificationPreferences.delete({ where: { id: params } });
    }
    return await prisma.notificationPreferences.delete(params as any);
  }
}
