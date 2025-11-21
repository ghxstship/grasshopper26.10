import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const sendMessageSchema = z.object({
  recipientId: z.string(),
  content: z.string().min(1).max(5000),
  threadId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');

    if (threadId) {
      const messages = await prisma.message.findMany({
        where: {
          threadId,
          OR: [
            { senderId: session.user.id },
            { recipientId: session.user.id },
          ],
        },
        include: {
          sender: { select: { id: true, name: true, image: true } },
          recipient: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: 'asc' },
      });

      return NextResponse.json({ success: true, data: { messages } });
    }

    // Get all threads
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { recipientId: session.user.id },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        recipient: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, data: { messages } });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch messages' } },
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
    const data = sendMessageSchema.parse(body);

    const threadId = data.threadId || `thread_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId: data.recipientId,
        content: data.content,
        threadId,
        read: false,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        recipient: { select: { id: true, name: true, image: true } },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: data.recipientId,
        type: 'MESSAGE',
        title: 'New Message',
        message: `${session.user.name} sent you a message`,
        actionUrl: `/messages?threadId=${threadId}`,
        read: false,
      },
    });

    return NextResponse.json({ success: true, data: { message } }, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to send message' } },
      { status: 500 }
    );
  }
}
