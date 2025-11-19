import { prisma } from '@/lib/prisma';

/**
 * N8nService for Workflow Status
 * Business logic for /n8n/workflows/status
 * Monitors N8N workflow trigger execution status
 */

export class N8nService {
  // Workflow trigger operations
  async findAll(filters?: any) {
    return await prisma.n8NTrigger.findMany(filters);
  }

  async findById(params: { where: { id: string } }) {
    return await prisma.n8NTrigger.findUnique(params);
  }

  async findByWorkflowId(workflowId: string) {
    return await prisma.n8NTrigger.findMany({
      where: { workflowId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats(workflowId?: string) {
    return await prisma.n8NTrigger.groupBy({
      by: ['active'],
      _count: true,
      where: workflowId ? { workflowId } : undefined,
    });
  }

  async create(params: { data: any }) {
    return await prisma.n8NTrigger.create(params);
  }

  async update(params: { where: { id: string }; data: any }) {
    return await prisma.n8NTrigger.update(params);
  }

  async delete(id: string) {
    return await prisma.n8NTrigger.delete({ where: { id } });
  }
}
