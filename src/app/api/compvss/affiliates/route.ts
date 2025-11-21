import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { handleApiError } from '@/lib/api/response';
import { CompvssService } from '@/lib/services/compvss/affiliates.service';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';



const _querySchema = z.object({}).passthrough();

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const [affiliates, total] = await Promise.all([
      prisma.affiliateProfile.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.affiliateProfile.count(),
    ]);

    return NextResponse.json({
      affiliates,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
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
    const affiliate = await new CompvssService().create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(affiliate, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
