import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const [ticketsSold, revenue, attendees] = await Promise.all([
      prisma.ticket.count({ where: { eventId: id } }),
      prisma.order.aggregate({
        where: { eventId: id, status: 'COMPLETED' },
        _sum: { total: true },
      }),
      prisma.ticket.count({ where: { eventId: id, status: 'USED' } }),
    ]);

    const analytics = {
      ticketsSold,
      revenue: revenue._sum?.total ? Number(revenue._sum.total) : 0,
      attendees,
      conversionRate: ticketsSold > 0 ? (attendees / ticketsSold) * 100 : 0,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error getting event analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
