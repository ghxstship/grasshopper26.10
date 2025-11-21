import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { TicketsService } from '@/lib/services/tickets/id/refund.service';



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
    const body = await req.json();

    const ticket = await new TicketsService().update({
      where: { id },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date(),
        refundReason: body.reason,
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    return handleApiError(error);
  }
}
