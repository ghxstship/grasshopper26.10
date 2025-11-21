import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { TaskStatus } from '@prisma/client';
import { handleApiError } from '@/lib/api/response';
import { CompvssService } from '@/lib/services/compvss/tasks/id/complete.service';



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
    const task = await new CompvssService().update({
      where: { id },
      data: {
        status: TaskStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return handleApiError(error);
  }
}
