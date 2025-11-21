import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const message = await prisma.message.findUnique({
      where: { id },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        recipient: { select: { id: true, name: true, image: true } },
      },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Message not found' } },
        { status: 404 }
      );
    }

    if (message.senderId !== session.user.id && message.recipientId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Access denied' } },
        { status: 403 }
      );
    }

    // Mark as read if recipient
    if (message.recipientId === session.user.id && !message.read) {
      await prisma.message.update({
        where: { id },
        data: { read: true, readAt: new Date() },
      });
    }

    return NextResponse.json({ success: true, data: { message } });
  } catch (error) {
    console.error('Message fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch message' } },
      { status: 500 }
    );
  }
}
