import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, noContentResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const task = await prisma.dayOfShowTask.findUnique({
      where: { id },
    });

    if (!task) {
      throw errors.notFound('Task not found');
    }

    return successResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const task = await prisma.dayOfShowTask.update({
      where: { id },
      data: body,
    });

    return successResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    await prisma.dayOfShowTask.delete({
      where: { id },
    });

    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
}
