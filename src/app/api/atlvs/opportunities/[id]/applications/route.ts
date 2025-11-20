import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { ApplicationService } from '@/lib/services/shared/application.service';
import { ApplicationStatus } from '@prisma/client';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';


/**
 * GET /api/atlvs/opportunities/[id]/applications
 * Get all applications for an opportunity
 */
const _querySchema = z.object({}).passthrough();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    
    const filters = {
      status: searchParams.get('status') as ApplicationStatus | undefined,
      rating: searchParams.get('rating') ? parseInt(searchParams.get('rating')!) : undefined,
    };

    const applications = await ApplicationService.getByOpportunity(id, filters);
    return NextResponse.json(applications);
  } catch (error) {
    return handleApiError(error);
  }
}
