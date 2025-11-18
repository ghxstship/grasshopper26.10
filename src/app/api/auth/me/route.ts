import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError,  } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Get current user with relations
    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        organizations: {
          select: {
            id: true,
            role: true,
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
              },
            },
          },
        },
        _count: {
          select: {
            orders: true,
            tickets: true,
            wishlists: true,
          },
        },
      },
    });

    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}
