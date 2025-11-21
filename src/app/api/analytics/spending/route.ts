import { NextRequest } from 'next/server';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth, rateLimit } from '@/lib/api/middleware';
import { RATE_LIMITS, RateLimitIdentifiers } from '@/lib/api/rate-limits';
import { prisma } from '@/lib/prisma';

// GET /analytics/spending
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    if (!rateLimit(
      RateLimitIdentifiers.byUserId(context.userId),
      RATE_LIMITS.PUBLIC_ENDPOINT.limit,
      RATE_LIMITS.PUBLIC_ENDPOINT.windowMs
    )) {
      throw errors.rateLimitExceeded();
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get all completed orders in the period
    const orders = await prisma.order.findMany({
      where: {
        userId: context.userId,
        status: 'COMPLETED',
        createdAt: { gte: startDate },
      },
      include: {
        event: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate spending by category
    const spendingByCategory: Record<string, number> = {};
    const spendingByMonth: Record<string, number> = {};
    let totalSpending = 0;

    orders.forEach((order: any) => {
      const orderTotal = parseFloat(order.total.toString());
      totalSpending += orderTotal;

      // Group by month
      const monthKey = order.createdAt.toISOString().substring(0, 7);
      spendingByMonth[monthKey] = (spendingByMonth[monthKey] || 0) + orderTotal;

      // Group by event category if available
      if (order.event?.category?.name) {
        const categoryName = order.event.category.name;
        spendingByCategory[categoryName] = (spendingByCategory[categoryName] || 0) + orderTotal;
      }
    });

    return successResponse({
      totalSpending,
      averageOrderValue: orders.length > 0 ? totalSpending / orders.length : 0,
      orderCount: orders.length,
      spendingByCategory,
      spendingByMonth,
      period: parseInt(period),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

