import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
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
    const { recipientEmail } = body;

    const recipient = await prisma.user.findUnique({ where: { email: recipientEmail } });
    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        userId: recipient.id,
        status: 'TRANSFERRED',
        transferredAt: new Date(),
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error transferring ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
