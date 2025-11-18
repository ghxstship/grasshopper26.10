import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    return successResponse({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
