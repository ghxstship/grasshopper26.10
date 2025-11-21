import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const [orders, tickets, loyalty, wishlist] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.ticket.count({ where: { userId: session.user.id } }),
      prisma.loyaltyPoints.findUnique({ where: { userId: session.user.id } }),
      prisma.wishlist.count({ where: { userId: session.user.id } }),
    ]);

    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
    const eventsAttended = new Set(orders.flatMap(o => o.items.map((i: any) => i.eventId))).size;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalSpent,
          eventsAttended,
          ticketsOwned: tickets,
          loyaltyPoints: loyalty?.points || 0,
          wishlistItems: wishlist,
        },
        recentOrders: orders,
      },
    });
  } catch (error) {
    console.error('Personal analytics error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch analytics' } },
      { status: 500 }
    );
  }
}
