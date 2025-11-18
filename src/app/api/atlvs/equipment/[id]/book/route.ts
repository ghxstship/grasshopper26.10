import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const { startDate, endDate, purpose } = body;

    // Check for conflicts
    const conflicts = await prisma.equipmentBooking.findMany({
      where: {
        equipmentId: id,
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(startDate) } },
              { endDate: { gte: new Date(startDate) } },
            ],
          },
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(endDate) } },
            ],
          },
        ],
      },
    });

    if (conflicts.length > 0) {
      throw errors.conflict('Equipment is already booked for this time period');
    }

    const booking = await prisma.equipmentBooking.create({
      data: {
        equipmentId: id,
        userId: context.userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        purpose,
      },
      include: {
        equipment: true,
      },
    });

    return successResponse(booking);
  } catch (error) {
    return handleApiError(error);
  }
}
