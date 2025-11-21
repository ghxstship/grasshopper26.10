import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';


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
