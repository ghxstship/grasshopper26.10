import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { BudgetService } from '@/lib/services/atlvs/budget.service';

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
    const body = await req.json();
    const { notes } = body;

    const result = await BudgetService.approve(id, session.user.id, notes);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error approving budget:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
