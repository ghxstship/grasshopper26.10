import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = await params;
    await prisma.wishlist.delete({ where: { id: itemId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing wishlist item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
