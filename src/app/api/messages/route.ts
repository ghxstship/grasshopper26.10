import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // TODO: Message model not yet implemented in Prisma schema
    // This endpoint requires the Message model to be added to schema.prisma
    return NextResponse.json(
      { success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Messaging feature not yet implemented' } },
      { status: 501 }
    );
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch messages' } },
      { status: 500 }
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // TODO: Message model not yet implemented in Prisma schema
    return NextResponse.json(
      { success: false, error: { code: 'NOT_IMPLEMENTED', message: 'Messaging feature not yet implemented' } },
      { status: 501 }
    );
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to send message' } },
      { status: 500 }
    );
  }
}
