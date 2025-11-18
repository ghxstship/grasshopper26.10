import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, handleApiError, errors } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const expense = await prisma.expenseReport.findUnique({
      where: { id: id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!expense) {
      throw errors.notFound('Expense not found');
    }

    return successResponse(expense);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const expense = await prisma.expenseReport.update({
      where: { id: id },
      data: body,
    });

    return successResponse(expense);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const context = await validateRequest(request);
    requireAuth(context);

    await prisma.expenseReport.delete({
      where: { id: id },
    });

    return successResponse({ message: 'Expense deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
