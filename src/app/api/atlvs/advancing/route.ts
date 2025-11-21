import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth';
import { AdvancingRequestService } from '@/lib/services/atlvs/advancing/AdvancingRequestService';
import { AdvancingCategory, AdvancingStatus, Priority } from '@prisma/client';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { errors } from '@/lib/api/response';


const createRequestSchema = z.object({
  eventId: z.string().optional(),
  category: z.nativeEnum(AdvancingCategory),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  dueDate: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const listRequestsSchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

/**
 * GET /api/atlvs/advancing
 * List advancing requests with filters
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(session.user.id),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    
    const validated = listRequestsSchema.parse(params);

    const service = new AdvancingRequestService();
    const result = await service.list(
      {
        userId: session.user.id,
        status: validated.status as AdvancingStatus | undefined,
        category: validated.category as AdvancingCategory | undefined,
        priority: validated.priority as Priority | undefined,
        search: validated.search,
      },
      validated.page ? parseInt(validated.page) : 1,
      validated.limit ? parseInt(validated.limit) : 20
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error listing advancing requests:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to list advancing requests' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/atlvs/advancing
 * Create a new advancing request
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(session.user.id),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.json();
    const validated = createRequestSchema.parse(body);

    const service = new AdvancingRequestService();
    const advancingRequest = await service.create({
      userId: session.user.id,
      eventId: validated.eventId,
      category: validated.category,
      title: validated.title,
      description: validated.description,
      priority: validated.priority,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined,
      metadata: validated.metadata,
    });

    return NextResponse.json(advancingRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating advancing request:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create advancing request' },
      { status: 500 }
    );
  }
}
