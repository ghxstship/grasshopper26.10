import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { EventsService } from '@/lib/services/events/id/cancel.service';



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

    const event = await new EventsService().update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    return handleApiError(error);
  }
}
