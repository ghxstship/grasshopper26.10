import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // TODO: Message model not implemented in Prisma schema
    return NextResponse.json(
      { success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Messaging not implemented' } },
      { status: 501 }
    );
  } catch (error) {
    console.error('Message fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch message' } },
      { status: 500 }
    );
  }
}
