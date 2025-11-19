/**
 * API Route: /api/atlvs/assets/[id]/book
 * Book an asset
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssetService } from '@/lib/services/atlvs/asset.service';
import { z } from 'zod';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { handleApiError } from '@/lib/api/response';



const bookAssetSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  purpose: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = bookAssetSchema.parse(body);

    const booking = await AssetService.book({
      equipmentId: id,
      userId: session.user.id,
      startDate: new Date(validated.startDate),
      endDate: new Date(validated.endDate),
      purpose: validated.purpose,
      metadata: validated.metadata ? JSON.parse(JSON.stringify(validated.metadata)) : undefined,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error booking asset:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes('not available')) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
      if (error.message.includes('already booked')) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
    }

    return NextResponse.json(
      { error: 'Failed to book asset' },
      { status: 500 }
    );
  }
}
