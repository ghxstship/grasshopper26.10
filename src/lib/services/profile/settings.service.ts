import { prisma } from '@/lib/prisma';

/**
 * SettingsService
 * Business logic for /profile/settings
 */

export class ProfileService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.profile.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.profile.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.profile.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.profile.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.profile.delete({ where: { id } });
  }
}
