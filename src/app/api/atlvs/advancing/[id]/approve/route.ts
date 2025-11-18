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
    const { notes } = body;

    const service = new AdvancingRequestService();
    const result = await service.approve(id, session.user.id, notes);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error approving advancing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
