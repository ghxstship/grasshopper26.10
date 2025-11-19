import { BaseService } from '../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * CompvssService
 * Business logic for COMPVSS day-of-show tasks
 */

export class CompvssService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.dayOfShowTask.findMany(filters);
  }

  async findById(params: any) {
    return await prisma.dayOfShowTask.findUnique(params);
  }

  async create(params: any) {
    return await prisma.dayOfShowTask.create(params);
  }

  async update(params: any) {
    return await prisma.dayOfShowTask.update(params);
  }

  async delete(params: any) {
    return await prisma.dayOfShowTask.delete(params);
  }

  async execute(data: any) {
    return data;
  }
}
