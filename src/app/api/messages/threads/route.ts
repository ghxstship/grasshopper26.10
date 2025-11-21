import { NextRequest, NextResponse } from 'next/server';
import getServerSession from 'next-auth';
import { authConfig } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

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
    });

    // Group by threadId
    const threads: Record<string, any> = {};
    messages.forEach((msg) => {
      if (!threads[msg.threadId]) {
        threads[msg.threadId] = {
          threadId: msg.threadId,
          lastMessage: msg,
          unreadCount: 0,
          messages: [],
        };
      }
      threads[msg.threadId].messages.push(msg);
      if (!msg.read && msg.recipientId === session.user.id) {
        threads[msg.threadId].unreadCount++;
      }
    });

    const threadList = Object.values(threads).sort((a, b) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: { threads: threadList },
    });
  } catch (error) {
    console.error('Threads fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch threads' } },
      { status: 500 }
    );
  }
}
