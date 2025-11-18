import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ExpenseStatus } from '@prisma/client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        status: ExpenseStatus.REIMBURSED,
        reimbursedAt: new Date(),
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error reimbursing expense:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
