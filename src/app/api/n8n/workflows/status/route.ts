import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { errors } from "@/lib/api/errors";
import { handleApiError } from '@/lib/api/response';
import { N8nService } from '@/lib/services/n8n/workflows/status.service';




/**
 * N8N Workflow Execution Status API
 * Monitor workflow trigger execution status
 */
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.READ_OPERATIONS.limit,
        RATE_LIMITS.READ_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflowId');

    const n8nService = new N8nService();

    // Get workflows based on filters
    const workflows = await n8nService.findAll({
      where: workflowId ? { workflowId } : {},
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    // Get statistics
    const stats = await n8nService.getStats(workflowId || undefined);

    return NextResponse.json({
      workflows: workflows.map(w => ({
        id: w.id,
        workflowId: w.workflowId,
        type: w.type,
        active: w.active,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      })),
      stats: stats.reduce((acc, s) => {
        acc[s.active ? 'active' : 'inactive'] = s._count;
        return acc;
      }, {} as Record<string, number>),
      total: workflows.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
