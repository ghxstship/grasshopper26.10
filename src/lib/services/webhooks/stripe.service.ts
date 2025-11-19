import { prisma } from '@/lib/prisma';

/**
 * StripeService
 * Business logic for /webhooks/stripe
 */

export class WebhooksService {
  // Add service methods here
  async findAll(filters?: any) {
    return await prisma.webhooks.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.webhooks.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.webhooks.create({ data });
  }

  async update(id: string, data: any) {
    return await prisma.webhooks.update({ where: { id }, data });
  }

  async delete(id: string) {
    return await prisma.webhooks.delete({ where: { id } });
  }
}
