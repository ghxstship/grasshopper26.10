import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';
import { createAlertSchema } from '@/lib/validations/alerts';

export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const alerts = await prisma.alert.findMany({
      where: {
        userId: context.userId,
        active: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(alerts);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const validatedData = createAlertSchema.parse(body);
    
    const alert = await prisma.alert.create({
      data: {
        ...validatedData,
        userId: context.userId,
      } as any,
    });

    return createdResponse(alert);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get('id');

    if (!alertId) {
      throw new Error('Alert ID required');
    }

    await prisma.alert.delete({
      where: {
        id: alertId,
        userId: context.userId,
      },
    });

    return successResponse({ message: 'Alert deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
