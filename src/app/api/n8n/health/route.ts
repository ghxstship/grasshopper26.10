import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { errors } from "@/lib/api/errors";
import { N8nService } from '@/lib/services/n8n/health.service';




/**
 * N8N Integration Health Check
 * Monitors N8N integration status and connectivity
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

    const healthService = new N8nService();
    const healthStatus = await healthService.getHealthStatus();

    const allHealthy = healthStatus.status === 'healthy';

    return NextResponse.json(
      {
        status: healthStatus.status,
        checks: {
          database: healthStatus.database,
          webhooks: healthStatus.webhooks,
          workflows: healthStatus.workflows,
          timestamp: healthStatus.timestamp,
        },
      },
      { status: allHealthy ? 200 : 503 }
    );
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
