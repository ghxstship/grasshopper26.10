import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { BudgetService } from '@/lib/services/atlvs/budget.service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await BudgetService.getExpenses({ budgetId: id });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting budget expenses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = await BudgetService.addExpense(id, body, session.user.id);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error adding budget expense:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
