import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { z } from 'zod';
import { AdventuresService } from '@/lib/services/adventures/id/book.service';



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

    const adventure = await new AdventuresService().findById({
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

    const booking = await new AdventuresService().create({
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
