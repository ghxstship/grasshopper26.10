import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { z } from 'zod';
import { handleApiError } from '@/lib/api/response';
import { DestinationsService } from '@/lib/services/destinations.service';
import { errors } from '@/lib/api/errors';




export async function GET(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    const where: any = category ? { category } : {};

    const destinations = await new DestinationsService().findAll({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(destinations);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.json();

    const destination = await new DestinationsService().create({
      data: body,
    });

    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
