import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';
import { TicketsService } from '@/lib/services/tickets/id/transfer.service';
import { z } from 'zod';



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
    const { recipientEmail } = body;

    const recipient = await new TicketsService().findById({ where: { email: recipientEmail } });
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    const ticket = await new TicketsService().update({
      where: { id },
      data: {
        userId: recipient.id,
        status: 'TRANSFERRED',
        transferredAt: new Date(),
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    return handleApiError(error);
  }
}
