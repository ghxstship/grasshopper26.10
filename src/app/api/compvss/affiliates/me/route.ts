import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';

import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const profile = await prisma.affiliateProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Affiliate profile not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { profile },
    });
  } catch (error) {
    console.error('Affiliate profile fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch profile' } },
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

    const existing = await prisma.affiliateProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFLICT', message: 'Affiliate profile already exists' } },
        { status: 409 }
      );
    }

    const body = await request.json();
    const code = `AFF${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`;

    const profile = await prisma.affiliateProfile.create({
      data: {
        userId: session.user.id,
        code,
        name: body.name || session.user.name,
        email: body.email || session.user.email,
        phone: body.phone,
        commissionRate: body.commissionRate || 10,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, data: { profile } }, { status: 201 });
  } catch (error) {
    console.error('Affiliate profile creation error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create profile' } },
      { status: 500 }
    );
  }
}
