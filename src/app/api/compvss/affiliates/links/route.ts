import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createLinkSchema = z.object({
  targetType: z.enum(['event', 'product', 'membership']),
  targetId: z.string(),
  expiresAt: z.string().optional(),
});

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const links = await prisma.referralLink.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: { links },
    });
  } catch (error) {
    console.error('Referral links fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch links' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = createLinkSchema.parse(body);

    const code = `REF${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;

    const link = await prisma.referralLink.create({
      data: {
        userId: session.user.id,
        code,
        targetType: data.targetType,
        targetId: data.targetId,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });

    return NextResponse.json({ success: true, data: { link } }, { status: 201 });
  } catch (error) {
    console.error('Referral link creation error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create link' } },
      { status: 500 }
    );
  }
}
