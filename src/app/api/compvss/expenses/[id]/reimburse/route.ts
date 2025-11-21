import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ExpenseStatus } from '@prisma/client';
import { handleApiError } from '@/lib/api/response';
import { CompvssService } from '@/lib/services/compvss/expenses/id/reimburse.service';



// Validation: z.object schema.parse validate
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

    const expense = await new CompvssService().update({
      where: { id },
      data: {
        status: ExpenseStatus.REIMBURSED,
        reimbursedAt: new Date(),
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    return handleApiError(error);
  }
}
