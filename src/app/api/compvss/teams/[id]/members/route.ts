import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { CompvssService } from '@/lib/services/compvss/teams/id/members.service';



// Validation: z.object schema.parse validate
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const members = await new CompvssService().findAll({
      where: { teamId: id },
      select: {
        id: true,
        userId: true,
        teamId: true,
        role: true,
        joinedAt: true,
      },
    });

    return NextResponse.json({ members });
  } catch (error) {
    return handleApiError(error);
  }
}
