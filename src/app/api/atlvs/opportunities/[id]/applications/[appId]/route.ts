import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApplicationService } from '@/lib/services/shared/application.service';
import { updateApplicationStatusSchema } from '@/lib/validations/opportunities';
import { handleApiError } from '@/lib/api/response';


/**
 * PATCH /api/atlvs/opportunities/[id]/applications/[appId]
 * Update application status (review, approve, reject, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; appId: string }> }
) {
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appId } = await params;
    const body = await request.json();
    const validated = updateApplicationStatusSchema.parse({
      ...body,
      reviewedBy: session.user.id,
    });

    const application = await ApplicationService.updateStatus(appId, validated);
    return NextResponse.json(application);
  } catch (error) {
    return handleApiError(error);
  }
}
