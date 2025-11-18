import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AdvancingRequestService } from '@/lib/services/atlvs/advancing/AdvancingRequestService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const service = new AdvancingRequestService();
    const result = await service.getHistory(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting advancing request history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
