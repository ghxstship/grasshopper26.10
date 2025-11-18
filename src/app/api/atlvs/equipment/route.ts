import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const equipment = await prisma.equipment.findMany({
      where: where as never,
      include: {
        bookings: {
          where: {
            endDate: { gte: new Date() },
          },
          orderBy: { startDate: 'asc' },
        },
      },
    });

    return successResponse(equipment);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const equipment = await prisma.equipment.create({
      data: body,
    });

    return createdResponse(equipment);
  } catch (error) {
    return handleApiError(error);
  }
}
