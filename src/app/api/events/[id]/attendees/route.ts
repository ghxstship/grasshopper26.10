import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';
import { EventsService as _EventsService } from '@/lib/services/events/id/attendees.service';



const _querySchema = z.object({}).passthrough();

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
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where: { eventId: id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ticket.count({ where: { eventId: id } }),
    ]);

    return NextResponse.json({
      attendees: tickets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
