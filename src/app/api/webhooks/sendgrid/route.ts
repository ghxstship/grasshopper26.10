/**
 * SendGrid webhook handler
 * Handles email events (delivered, opened, clicked, bounced, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const events = await request.json();

    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    for (const event of events) {
      switch (event.event) {
        case 'delivered':
          await handleEmailDelivered(event);
          break;

        case 'open':
          await handleEmailOpened(event);
          break;

        case 'click':
          await handleEmailClicked(event);
          break;

        case 'bounce':
          await handleEmailBounced(event);
          break;

        case 'dropped':
          await handleEmailDropped(event);
          break;

        case 'spamreport':
          await handleSpamReport(event);
          break;

        case 'unsubscribe':
          await handleUnsubscribe(event);
          break;

        default:
          console.log(`Unhandled SendGrid event: ${event.event}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('SendGrid webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleEmailDelivered(event: any) {  
  console.log('Email delivered:', event.email);
  
  // Update email status in database
  const { prisma } = await import('@/lib/prisma');
  await prisma.auditLog.create({
    data: {
      action: 'EMAIL_DELIVERED',
      entity: 'Email',
      metadata: {
        email: event.email,
        messageId: event.sg_message_id,
        timestamp: event.timestamp,
      },
    },
  }).catch((err: unknown) => console.error('Failed to log email delivery:', err));
}

async function handleEmailOpened(event: any) {  
  console.log('Email opened:', event.email);
  
  // Track email open in analytics
  const { prisma } = await import('@/lib/prisma');
  await prisma.auditLog.create({
    data: {
      action: 'EMAIL_OPENED',
      entity: 'Email',
      metadata: {
        email: event.email,
        messageId: event.sg_message_id,
        timestamp: event.timestamp,
        userAgent: event.useragent,
      },
    },
  }).catch((err: unknown) => console.error('Failed to log email open:', err));
}

async function handleEmailClicked(event: any) {  
  console.log('Email link clicked:', event.url);
  
  // Track link click in analytics
  const { prisma } = await import('@/lib/prisma');
  await prisma.auditLog.create({
    data: {
      action: 'EMAIL_CLICKED',
      entity: 'Email',
      metadata: {
        email: event.email,
        url: event.url,
        messageId: event.sg_message_id,
        timestamp: event.timestamp,
      },
    },
  }).catch((err: unknown) => console.error('Failed to log email click:', err));
}

async function handleEmailBounced(event: any) {  
  console.log('Email bounced:', event.email);
  
  // Mark email as invalid in database
  await prisma.user.updateMany({
    where: { email: event.email },
    data: {
      emailVerified: null,
    },
  }).catch((err: unknown) => console.error('Failed to mark email as bounced:', err));
}

async function handleEmailDropped(event: any) {  
  console.log('Email dropped:', event.email);
  
  // Log dropped email
  await prisma.auditLog.create({
    data: {
      action: 'EMAIL_DROPPED',
      entity: 'Email',
      metadata: {
        email: event.email,
        reason: event.reason || 'unknown',
        timestamp: new Date().toISOString(),
      },
    },
  }).catch((err: unknown) => console.error('Failed to log dropped email:', err));
}

async function handleSpamReport(event: any) {  
  console.log('Spam report:', event.email);
  
  // Unsubscribe user from emails
  await prisma.user.updateMany({
    where: { email: event.email },
    data: {
      emailVerified: null,
    },
  }).catch((err: unknown) => console.error('Failed to unsubscribe user:', err));
}

async function handleUnsubscribe(event: any) {  
  console.log('User unsubscribed:', event.email);
  
  // Update user email preferences
  await prisma.user.updateMany({
    where: { email: event.email },
    data: {
      emailVerified: null,
    },
  }).catch((err: unknown) => console.error('Failed to update email preferences:', err));
}
