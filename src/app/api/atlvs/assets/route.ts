import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AssetService } from '@/lib/services/atlvs/asset.service';
import { EquipmentStatus } from '@prisma/client';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';
import { z } from 'zod';


const _querySchema = z.object({}).passthrough();

export async function GET(req: NextRequest) {
  try {
    // DB: await prisma.$queryRaw`SELECT 1`;
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const statusParam = searchParams.get('status');
    const filters = {
      type: searchParams.get('type') || undefined,
      status: statusParam && Object.values(EquipmentStatus).includes(statusParam as EquipmentStatus) 
        ? (statusParam as EquipmentStatus) 
        : undefined,
      search: searchParams.get('search') || undefined,
    };

    const result = await AssetService.getAll(filters);
    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = await AssetService.create(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
