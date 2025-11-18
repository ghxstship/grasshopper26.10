import { prisma } from '@/lib/prisma';

export interface CreateHistoryInput {
  requestId: string;
  userId?: string;
  action: string;
  fromValue?: string;
  toValue?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Service for managing advancing request history/audit trail
 */
export class HistoryService {
  /**
   * Create a history entry
   */
  async create(input: CreateHistoryInput) {
    return prisma.advancingHistory.create({
      data: {
        requestId: input.requestId,
        userId: input.userId,
        action: input.action,
        fromValue: input.fromValue,
        toValue: input.toValue,
        metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : undefined,
      },
    });
  }

  /**
   * Get history for a request
   */
  async listByRequest(requestId: string) {
    return prisma.advancingHistory.findMany({
      where: { requestId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get history by action type
   */
  async listByAction(requestId: string, action: string) {
    return prisma.advancingHistory.findMany({
      where: {
        requestId,
        action,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get recent history entries
   */
  async getRecent(limit: number = 10) {
    return prisma.advancingHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
