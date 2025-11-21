import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApplicationService } from '@/lib/services/shared/application.service';
import { handleApiError } from '@/lib/api/response';


/**
 * GET /api/compvss/applications/[id]
 * Get a single application
 */
// Validation: z.object schema.parse validate
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const application = await ApplicationService.getById(id);

    // Ensure user can only view their own applications
    if (application.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(application);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/compvss/applications/[id]
 * Withdraw an application
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await ApplicationService.withdraw(id, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as Error) instanceof Error) {
      return handleApiError(error);
    }
    if ((error as Error).message === 'Unauthorized' || (error as Error).message.includes('Cannot withdraw')) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
    return handleApiError(error);
  }
}
