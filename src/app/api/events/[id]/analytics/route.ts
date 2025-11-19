import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';
import { EventsService } from '@/lib/services/events/id/analytics.service';
import { z } from 'zod';



// Validation: z.object schema.parse validate
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
    const event = await new EventsService().findById({ where: { id } });

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
    return handleApiError(error);
  }
}
