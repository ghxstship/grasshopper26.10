import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { rateLimit, getClientIdentifier } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { handleApiError } from '@/lib/api/response';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';


const querySchema = z.object({}).passthrough();

export async function GET(req: NextRequest) {
  try {
    // Database: await prisma.$queryRaw`SELECT 1`;
    // Database operations available via prisma
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type');

    const reports = [
      {
        id: '1',
        name: 'Monthly Advancing Report',
        type: 'advancing',
        generatedAt: new Date(),
        format: 'pdf',
      },
      {
        id: '2',
        name: 'Budget Utilization Report',
        type: 'budget',
        generatedAt: new Date(),
        format: 'excel',
      },
    ].filter(r => !type || r.type === type);

    return NextResponse.json({ reports });
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
    const report = {
      id: crypto.randomUUID(),
      ...body,
      generatedAt: new Date(),
      generatedBy: session.user.id,
    };

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
