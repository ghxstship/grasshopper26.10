import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApplicationService } from '@/lib/services/shared/application.service';

/**
 * GET /api/compvss/applications/[id]
 * Get a single application
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
    if (error instanceof Error && error.message === 'Application not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
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
    if (error instanceof Error) {
      if (error.message === 'Application not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error.message === 'Unauthorized' || error.message.includes('Cannot withdraw')) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }

    console.error('Error withdrawing application:', error);
    return NextResponse.json(
      { error: 'Failed to withdraw application' },
      { status: 500 }
    );
  }
}
