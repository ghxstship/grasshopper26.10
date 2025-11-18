import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, createdResponse, handleApiError } from '@/lib/api/response';
import { validateRequest, requireAuth, getPaginationParams } from '@/lib/api/middleware';

export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPaginationParams(request);
    
    const where: Record<string, unknown> = {};
    const status = searchParams.get('status');
    
    if (status) where.status = status;

    const [expenses, total] = await Promise.all([
      prisma.expenseReport.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.expenseReport.count({ where }),
    ]);

    return successResponse(expenses, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    const body = await request.json();
    const expense = await prisma.expenseReport.create({
      data: {
        ...body,
        userId: context.userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return createdResponse(expense);
  } catch (error) {
    return handleApiError(error);
  }
}
