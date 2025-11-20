import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';
import { WishlistsService } from '@/lib/services/wishlists/id/items.service';
import { z } from 'zod';



// Validation: z.object schema.parse validate
export async function POST(
  req: NextRequest,
  { params: params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const item = await new WishlistsService().create({
      data: {
        userId: session.user.id,
        eventId: body.eventId,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
