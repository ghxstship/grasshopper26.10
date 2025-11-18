import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    console.error('Error listing affiliates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const affiliate = await prisma.affiliateProfile.create({
      data: {
        ...body,
        userId: session.user.id,
      },
    });

    return NextResponse.json(affiliate, { status: 201 });
  } catch (error) {
    console.error('Error creating affiliate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
