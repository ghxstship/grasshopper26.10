import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const teams = await prisma.team.findMany({
      include: {
        members: {
          select: {
            id: true,
            userId: true,
            role: true,
          },
        },
        _count: { select: { members: true } },
      },
    });

    return successResponse(teams);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const team = await prisma.team.create({
      data: body,
      include: {
        members: true,
      },
    });

    return createdResponse(team);
  } catch (error) {
    return handleApiError(error);
  }
}
