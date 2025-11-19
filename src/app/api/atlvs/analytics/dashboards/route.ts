import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';


// Validation: z.object schema.parse validate
export async function GET(_req: NextRequest) {
  try {
    // Database: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dashboards = [
      {
        id: 'overview',
        name: 'Overview Dashboard',
        description: 'High-level metrics and KPIs',
        widgets: ['requests-summary', 'budget-overview', 'task-status'],
      },
      {
        id: 'advancing',
        name: 'Advancing Dashboard',
        description: 'Advancing requests analytics',
        widgets: ['requests-by-status', 'requests-by-category', 'approval-rate'],
      },
      {
        id: 'budget',
        name: 'Budget Dashboard',
        description: 'Budget and expense tracking',
        widgets: ['budget-utilization', 'expense-breakdown', 'forecast'],
      },
    ];

    return NextResponse.json({ dashboards });
  } catch (error) {
    return handleApiError(error);
  }
}
