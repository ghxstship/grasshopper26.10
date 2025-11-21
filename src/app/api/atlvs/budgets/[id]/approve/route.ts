import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { BudgetService } from '@/lib/services/atlvs/budget.service';
import { handleApiError } from '@/lib/api/response';


// Validation: z.object schema.parse validate
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
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
    return handleApiError(error);
  }
}
