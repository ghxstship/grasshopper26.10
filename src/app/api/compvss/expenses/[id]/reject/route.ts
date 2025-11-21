import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const rejectSchema = z.object({
  reason: z.string().min(1),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // Check if user has permission to reject expenses
    if (!['INTERNAL_TEAM', 'ADMIN', 'LEGEND_SUPER_ADMIN', 'LEGEND_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Insufficient permissions',
          },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = rejectSchema.parse(body);

    const expense = await prisma.expenseReport.findUnique({
      where: { id: id },
    });

    if (!expense) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Expense not found',
          },
        },
        { status: 404 }
      );
    }

    if (expense.status !== 'PENDING') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'Expense has already been processed',
          },
        },
        { status: 409 }
      );
    }

    const updatedExpense = await prisma.expenseReport.update({
      where: { id: id },
      data: {
        status: 'REJECTED',
        approvedById: session.user.id,
        approvedAt: new Date(),
        metadata: {
          ...(expense.metadata as object || {}),
          rejectionReason: validatedData.reason,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Create notification for submitter
    await prisma.notification.create({
      data: {
        userId: expense.userId,
        type: 'EXPENSE_REJECTED',
        title: 'Expense Report Rejected',
        message: `Your expense report "${expense.title}" has been rejected. Reason: ${validatedData.reason}`,
        read: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        expense: updatedExpense,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }

    console.error('Expense rejection error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to reject expense',
        },
      },
      { status: 500 }
    );
  }
}
