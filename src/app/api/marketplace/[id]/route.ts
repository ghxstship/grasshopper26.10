import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { z } from 'zod';
import { handleApiError } from '@/lib/api/response';
import { MarketplaceIdService } from '@/lib/services/marketplace/id.service';




export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const item = await new MarketplaceIdService().findById(resolvedParams.id);

    if (!item) {
      return NextResponse.json(
        { error: 'Marketplace item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();

    const item = await new MarketplaceIdService().update(resolvedParams.id, body);

    return NextResponse.json(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    await new MarketplaceIdService().delete(resolvedParams.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
