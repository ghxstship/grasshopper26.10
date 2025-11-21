import { NextRequest } from 'next/server';
import { updateEventSchema } from '@/lib/validations/events';
import type { Prisma } from '@prisma/client';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth } from '@/lib/api/middleware';
import { EventsService } from '@/lib/services/events/id.service';



type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/events/[id] - Get event by ID
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const event = await new EventsService().findById({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            website: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            color: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
            city: true,
            state: true,
            country: true,
            postalCode: true,
            latitude: true,
            longitude: true,
            capacity: true,
            imageUrl: true,
            website: true,
            phone: true,
          },
        },
        artists: {
          include: {
            artist: {
              select: {
                id: true,
                name: true,
                slug: true,
                bio: true,
                imageUrl: true,
                genre: true,
                website: true,
                socialLinks: true,
                verified: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        ticketTypes: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            currency: true,
            quantity: true,
            sold: true,
            maxPerOrder: true,
            salesStart: true,
            salesEnd: true,
          },
          orderBy: { price: 'asc' },
        },
        _count: {
          select: {
            tickets: true,
            orders: true,
            wishlists: true,
          },
        },
      },
    });

    if (!event) {
      throw errors.notFound('Event');
    }

    return successResponse(event);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/events/[id] - Update event
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = updateEventSchema.parse(body);

    const { id } = await params;

    // Check if event exists
    const existingEvent = await new EventsService().findById({
      where: { id },
    });

    if (!existingEvent) {
      throw errors.notFound('Event');
    }

    // Update event
    const event = await new EventsService().update({
      where: { id },
      data: validatedData as Prisma.EventUpdateInput,
      include: {
        organization: true,
        category: true,
        venue: true,
        artists: {
          include: {
            artist: true,
          },
        },
      },
    });

    return successResponse(event);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const { id } = await params;

    // Check if event exists
    const existingEvent = await new EventsService().findById({
      where: { id },
    });

    if (!existingEvent) {
      throw errors.notFound('Event');
    }

    // Delete event
    await new EventsService().delete({
      where: { id: id },
    });

    return successResponse({ message: 'Event deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
