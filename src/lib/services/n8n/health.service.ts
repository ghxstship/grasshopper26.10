import { prisma } from '@/lib/prisma';

/**
 * N8nService for Health Monitoring
 * Business logic for /n8n/health
 * Monitors N8N integration health and connectivity
 */

export class N8nService {
  // Health check operations
  async checkDatabase() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async checkWorkflows() {
    try {
      const count = await prisma.n8NTrigger.count({
        where: { active: true },
      });
      return count >= 0;
    } catch {
      return false;
    }
  }

  async checkWebhooks() {
    try {
      const count = await prisma.n8NWebhook.count({
        where: { active: true },
      });
      return count >= 0;
    } catch {
      return false;
    }
  }

  async getHealthStatus() {
    const [database, workflows, webhooks] = await Promise.all([
      this.checkDatabase(),
      this.checkWorkflows(),
      this.checkWebhooks(),
    ]);

    return {
      database,
      workflows,
      webhooks,
      timestamp: new Date().toISOString(),
      status: database && workflows && webhooks ? 'healthy' : 'degraded',
    };
  }
}
