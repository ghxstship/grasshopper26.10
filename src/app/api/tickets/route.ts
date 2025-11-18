import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError,  } from '@/lib/api/response';
import { getPaginationParams, validateRequest, requireAuth,  } from '@/lib/api/middleware';

// GET /api/tickets - List user tickets
export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);

    // Build where clause
    const where: Record<string, unknown> = {
      userId: context.userId,
    };

    const status = searchParams.get('status');
    const eventId = searchParams.get('eventId');

    if (status) where.status = status;
    if (eventId) where.eventId = eventId;

    // Get total count
    const total = await prisma.ticket.count({ where });

    // Get tickets
    const tickets = await prisma.ticket.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        ticketType: {
          select: {
            name: true,
            description: true,
            price: true,
            currency: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            startDate: true,
            endDate: true,
            status: true,
            venue: {
              select: {
                name: true,
                address: true,
                city: true,
                state: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
          },
        },
      },
    });

    return successResponse(tickets, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
