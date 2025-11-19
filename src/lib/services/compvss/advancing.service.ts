import { BaseService } from '../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * CompvssService
 * Business logic for COMPVSS advancing requests
 */

export class CompvssService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.advancingRequest.findMany(filters);
  }

  async findById(params: any) {
    return await prisma.advancingRequest.findUnique(params);
  }

  async create(params: any) {
    return await prisma.advancingRequest.create(params);
  }

  async update(params: any) {
    return await prisma.advancingRequest.update(params);
  }

  async delete(params: any) {
    return await prisma.advancingRequest.delete(params);
  }

  async execute(data: any) {
    return data;
  }
}
