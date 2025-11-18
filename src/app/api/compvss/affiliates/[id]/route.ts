import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { id },
    });

    if (!affiliate) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
    }

    return NextResponse.json(affiliate);
  } catch (error) {
    console.error('Error getting affiliate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const affiliate = await prisma.affiliateProfile.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(affiliate);
  } catch (error) {
    console.error('Error updating affiliate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
