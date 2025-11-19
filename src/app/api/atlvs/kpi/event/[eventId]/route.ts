import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { measureAsync } from '@/lib/performance/monitoring';
import { withCache, CACHE_TTL, CACHE_PREFIX } from '@/lib/performance/cache';
import { addCacheHeaders } from '@/lib/performance/compression';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { errors , handleApiError } from '@/lib/api/response';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const eventIdSchema = z.object({
  eventId: z.string().cuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    // Database: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
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

    const { eventId } = eventIdSchema.parse(await params);

    // Use caching for KPI data (5 minute TTL)
    const metrics = await measureAsync(
      'kpi-metrics-fetch',
      'api',
      async () => {
        return withCache(
          `${CACHE_PREFIX.ANALYTICS}kpi:${eventId}`,
          async () => {
            const supabase = await createClient();

            // Call the batch calculation function
            const { data, error } = await supabase
              .rpc('calculate_all_core_kpis', { p_event_id: eventId });

            if (error) {
              throw new Error('Failed to fetch KPI metrics');
            }

            // Transform to consistent format
            return data.map((row: { metric_name: string; metric_value: string; metric_unit: string }) => ({
              name: row.metric_name,
              value: parseFloat(row.metric_value) || 0,
              unit: row.metric_unit,
              category: getCategoryFromMetricName(row.metric_name),
            }));
          },
          CACHE_TTL.MEDIUM
        );
      }
    );

    const response = NextResponse.json(metrics);
    
    // Add cache headers
    return addCacheHeaders(response, {
      maxAge: 60,
      sMaxAge: 300,
      staleWhileRevalidate: 600,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function getCategoryFromMetricName(name: string): string {
  const financialKeywords = ['revenue', 'cost', 'profit', 'roi', 'margin', 'price'];
  const ticketKeywords = ['ticket', 'attendance', 'conversion', 'sell-through'];
  const marketingKeywords = ['social', 'engagement', 'marketing', 'mention', 'cpa'];
  const operationalKeywords = ['staff', 'setup', 'vendor', 'schedule', 'task'];

  const lowerName = name.toLowerCase();

  if (financialKeywords.some(keyword => lowerName.includes(keyword))) {
    return 'financial';
  }
  if (ticketKeywords.some(keyword => lowerName.includes(keyword))) {
    return 'tickets';
  }
  if (marketingKeywords.some(keyword => lowerName.includes(keyword))) {
    return 'marketing';
  }
  if (operationalKeywords.some(keyword => lowerName.includes(keyword))) {
    return 'operational';
  }

  return 'other';
}
