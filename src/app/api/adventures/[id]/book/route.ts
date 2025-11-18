import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const { date, quantity } = body;
    
    const { id } = await params;

    const adventure = await prisma.adventure.findUnique({
      where: { id },
    });

    if (!adventure) {
      throw errors.notFound('Adventure not found');
    }

    if (adventure.capacity) {
      const existingBookings = await prisma.adventureBooking.count({
        where: {
          adventureId: id,
          date: new Date(date),
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      });

      if (existingBookings + quantity > adventure.capacity) {
        throw errors.conflict('Not enough capacity available');
      }
    }

    const booking = await prisma.adventureBooking.create({
      data: {
        adventureId: id,
        userId: context.userId!,
        date: new Date(date),
        quantity,
        totalPrice: Number(adventure.price) * quantity,
        status: 'PENDING',
      },
      include: {
        adventure: true,
      },
    });

    return successResponse(booking);
  } catch (error) {
    return handleApiError(error);
  }
}
