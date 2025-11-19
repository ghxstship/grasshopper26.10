import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { OpportunityService } from '@/lib/services/shared/opportunity.service';
import { createOpportunitySchema, opportunityFiltersSchema,  } from '@/lib/validations/opportunities';
import { z } from 'zod';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { errors } from '@/lib/api/errors';


/**
 * GET /api/atlvs/opportunities
 * List all opportunities with filtering
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
    const filters = {
      organizationId: searchParams.get('organizationId') || undefined,
      projectId: searchParams.get('projectId') || undefined,
      eventId: searchParams.get('eventId') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
      locationType: searchParams.get('locationType') || undefined,
      compensationType: searchParams.get('compensationType') || undefined,
      search: searchParams.get('search') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    };

    const validated = opportunityFiltersSchema.parse(filters);
    const result = await OpportunityService.getAll({
      ...validated,
      page: filters.page,
      limit: filters.limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/atlvs/opportunities
 * Create a new opportunity
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
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
    const validated = createOpportunitySchema.parse(body);

    const opportunity = await OpportunityService.create({
      ...validated,
      createdBy: session.user.id,
    });

    return NextResponse.json(opportunity, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
