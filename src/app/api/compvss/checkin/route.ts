import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const { type, targetId, location, latitude, longitude, metadata } = body;

    const checkIn = await prisma.checkIn.create({
      data: {
        userId: context.userId!,
        type,
        targetId,
        location,
        latitude,
        longitude,
        metadata,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return successResponse(checkIn);
  } catch (error) {
    return handleApiError(error);
  }
}
