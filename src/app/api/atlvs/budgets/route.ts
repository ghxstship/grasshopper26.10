import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth } from '@/lib/api/middleware';

export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const where: Record<string, unknown> = {};
    if (projectId) where.projectId = projectId;

    const budgets = await prisma.budget.findMany({
      where: where as never,
      include: {
        project: { select: { id: true, name: true } },
        categories: true,
        _count: { select: { expenses: true } },
      },
    });

    return successResponse(budgets);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const budget = await prisma.budget.create({
      data: body,
      include: {
        project: { select: { id: true, name: true } },
        categories: true,
      },
    });

    return createdResponse(budget);
  } catch (error) {
    return handleApiError(error);
  }
}
