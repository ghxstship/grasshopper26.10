import { prisma } from '@/lib/prisma';

/**
 * BatchService for QR Code Processing
 * Business logic for /batch/qr-codes
 * Uses existing QRCode model from Prisma schema
 */

export class BatchService {
  // QR Code operations using existing QRCode model
  async findAll(filters?: any) {
    return await prisma.qRCode.findMany(filters);
  }

  async findById(params: { where: { id: string } }) {
    return await prisma.qRCode.findUnique(params);
  }

  async create(params: { data: any }) {
    return await prisma.qRCode.create(params);
  }

  async createMany(params: { data: any[] }) {
    return await prisma.qRCode.createMany(params);
  }

  async update(params: { where: { id: string }; data: any }) {
    return await prisma.qRCode.update(params);
  }

  async delete(id: string) {
    return await prisma.qRCode.delete({ where: { id } });
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
