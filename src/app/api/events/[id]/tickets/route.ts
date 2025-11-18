import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createTicketTypeSchema } from '@/lib/validations/events';
import type { Prisma as _Prisma } from '@prisma/client';
import { successResponse, createdResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth,  } from '@/lib/api/middleware';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/events/[id]/tickets - Get event ticket types
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: id },
    });

    if (!event) {
      throw errors.notFound('Event');
    }

    // Get ticket types
    const ticketTypes = await prisma.ticketType.findMany({
      where: { eventId: id },
      orderBy: { price: 'asc' },
    });

    return successResponse(ticketTypes);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/events/[id]/tickets - Create ticket type for event
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody<Record<string, unknown>>(request);
    const validatedData = createTicketTypeSchema.parse({
      ...(body as object),
      eventId: id,
    });

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: id },
    });

    if (!event) {
      throw errors.notFound('Event');
    }

    // Create ticket type
    const { eventId, metadata, ...ticketData } = validatedData;
    const ticketType = await prisma.ticketType.create({
      data: {
        ...ticketData,
        event: {
          connect: { id: eventId }
        },
        metadata: metadata as never
      },
    });

    return createdResponse(ticketType);
  } catch (error) {
    return handleApiError(error);
  }
}
