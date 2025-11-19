import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApplicationService } from '@/lib/services/shared/application.service';
import { createApplicationSchema } from '@/lib/validations/opportunities';
import { z } from 'zod';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';


/**
 * POST /api/compvss/opportunities/[id]/apply
 * Submit an application to an opportunity
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const validated = createApplicationSchema.parse({
      ...body,
      opportunityId: id,
      userId: session.user.id,
    });

    const application = await ApplicationService.create(validated);
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (
        error.message.includes('already applied') ||
        error.message.includes('not accepting') ||
        error.message.includes('deadline')
      ) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      if (error.message === 'Opportunity not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }

    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
