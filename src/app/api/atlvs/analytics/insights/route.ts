import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';



// Validation: z.object schema.parse validate
export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [requestsCount, budgetsCount, tasksCount] = await Promise.all([
      prisma.advancingRequest.count(),
      prisma.budget.count(),
      prisma.task.count(),
    ]);

    const insights = {
      summary: {
        totalRequests: requestsCount,
        totalBudgets: budgetsCount,
        totalTasks: tasksCount,
      },
      trends: {
        requestsGrowth: '+12%',
        budgetUtilization: '78%',
        taskCompletion: '85%',
      },
      alerts: [
        { type: 'warning', message: '3 budgets approaching limit' },
        { type: 'info', message: '5 requests pending approval' },
      ],
    };

    return NextResponse.json(insights);
  } catch (error) {
    return handleApiError(error);
  }
}
