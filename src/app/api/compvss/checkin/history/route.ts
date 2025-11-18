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
    const userId = searchParams.get('userId') || session.user.id;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const [checkins, total] = await Promise.all([
      prisma.checkIn.findMany({
        where: { userId },
        orderBy: { checkInTime: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.checkIn.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      checkins,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error getting check-in history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
