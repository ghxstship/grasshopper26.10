import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AdvancingRequestService } from '@/lib/services/atlvs/advancing/AdvancingRequestService';

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
    const { reason } = body;

    if (!reason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const service = new AdvancingRequestService();
    const result = await service.reject(id, session.user.id, reason);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error rejecting advancing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
