import { prisma } from '@/lib/prisma';

/**
 * BatchService for Notification Processing
 * Business logic for /batch/notifications
 * Uses existing Notification model from Prisma schema
 */

export class BatchService {
  // Notification operations using existing Notification model
  async findAll(filters?: any) {
    return await prisma.notification.findMany(filters);
  }

  async findById(params: { where: { id: string } }) {
    return await prisma.notification.findUnique(params);
  }

  async create(params: { data: any }) {
    return await prisma.notification.create(params);
  }

  async createMany(params: { data: any[] }) {
    return await prisma.notification.createMany(params);
  }

  async update(params: { where: { id: string }; data: any }) {
    return await prisma.notification.update(params);
  }

  async delete(id: string) {
    return await prisma.notification.delete({ where: { id } });
  }

  // Batch job tracking
  async createBatchJob(params: { data: any }) {
    return await prisma.batchJob.create(params);
  }

  async updateBatchJob(params: { where: { id: string }; data: any }) {
    return await prisma.batchJob.update(params);
  }

  async getBatchJob(id: string) {
    return await prisma.batchJob.findUnique({ where: { id } });
  }
}
