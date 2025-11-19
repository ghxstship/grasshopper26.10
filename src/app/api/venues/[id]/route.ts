import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateVenueSchema } from '@/lib/validations/events';
import { successResponse, handleApiError, errors,  } from '@/lib/api/response';
import { parseBody, validateRequest, requireAuth,  } from '@/lib/api/middleware';
import { VenuesService } from '@/lib/services/venues/id.service';



type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// GET /api/venues/[id] - Get venue by ID
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const venue = await new VenuesService().findById({
      where: { id: id },
      include: {
        events: {
          where: {
            status: 'PUBLISHED',
            startDate: {
              gte: new Date(),
            },
          },
          take: 10,
          orderBy: {
            startDate: 'asc',
          },
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    if (!venue) {
      throw errors.notFound('Venue');
    }

    return successResponse(venue);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/venues/[id] - Update venue
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await parseBody(request);
    const validatedData = updateVenueSchema.parse(body);

    // Check if venue exists
    const existingVenue = await new VenuesService().findById({
      where: { id: id },
    });

    if (!existingVenue) {
      throw errors.notFound('Venue');
    }

    // Update venue
    const venue = await new VenuesService().update({
      where: { id: id },
      data: validatedData as any,
    });

    return successResponse(venue);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/venues/[id] - Delete venue
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    // Check if venue exists
    const existingVenue = await prisma.venue.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    if (!existingVenue) {
      throw errors.notFound('Venue');
    }

    // Prevent deletion if venue has events
    if (existingVenue._count.events > 0) {
      throw errors.badRequest(
        'Cannot delete venue with existing events',
        { eventCount: existingVenue._count.events }
      );
    }

    // Delete venue
    await new VenuesService().delete({
      where: { id: id },
    });

    return successResponse({ message: 'Venue deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
