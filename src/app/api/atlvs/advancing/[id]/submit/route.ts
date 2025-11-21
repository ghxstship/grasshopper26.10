import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AdvancingRequestService } from '@/lib/services/atlvs/advancing/AdvancingRequestService';
import { handleApiError } from '@/lib/api/response';


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
    const service = new AdvancingRequestService();
    const result = await service.submitForReview(id, session.user.id);

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
