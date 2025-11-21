/**
 * Stripe webhook handler
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendEmail } from '@/lib/integrations/communication/sendgrid';
import { verifyWebhookSignature } from '@/lib/integrations/stripe';
import { rateLimit } from "@/lib/api/middleware";
import { RATE_LIMITS, RateLimitIdentifiers } from "@/lib/api/rate-limits";
import { validateRequest, requireAuth } from "@/lib/api/middleware";
import { handleApiError } from '@/lib/api/response';
import { errors } from '@/lib/api/errors';
import { prisma } from '@/lib/prisma';



export async function POST(request: NextRequest) {
  try {
    const context = await validateRequest(request);
    requireAuth(context);

    // Rate limiting
    if (
      !rateLimit(
        RateLimitIdentifiers.byUserId(context.userId),
        RATE_LIMITS.WRITE_OPERATIONS.limit,
        RATE_LIMITS.WRITE_OPERATIONS.windowMs,
      )
    ) {
      throw errors.rateLimitExceeded();
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const event = verifyWebhookSignature(body, signature);

    if (!event) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return handleApiError(error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'COMPLETED',
      paymentIntent: paymentIntent.id,
    },
  });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, event: true },
  });

  if (order) {
    await sendEmail({
      to: order.user.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      templateId: process.env.SENDGRID_ORDER_CONFIRMATION_TEMPLATE_ID,
      dynamicData: { order, event: order.event },
    });
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata?.orderId;
  if (!orderId) return;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' },
  });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (order) {
    await sendEmail({
      to: order.user.email,
      subject: 'Payment Failed',
      html: `<p>Your payment for order ${order.orderNumber} failed. Please try again.</p>`,
    });
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  const { prisma } = await import('@/lib/prisma');
  const customerId = subscription.customer as string;
  
  await prisma.user.updateMany({
    where: {
      accounts: {
        some: {
          providerAccountId: customerId,
        },
      },
    },
    data: {},
  }).catch(err => console.error('Failed to update subscription:', err));
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  const { prisma } = await import('@/lib/prisma');
  const customerId = subscription.customer as string;
  
  await prisma.user.updateMany({
    where: {
      accounts: {
        some: {
          providerAccountId: customerId,
        },
      },
    },
    data: {},
  }).catch(err => console.error('Failed to delete subscription:', err));
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log('Charge refunded:', charge.id);
  
  const { prisma } = await import('@/lib/prisma');
  
  await prisma.order.updateMany({
    where: {
      paymentIntent: charge.payment_intent as string,
    },
    data: {
      status: 'REFUNDED',
      metadata: {
        refundedAt: new Date().toISOString(),
        refundAmount: charge.amount_refunded,
      },
    },
  }).catch(err => console.error('Failed to update refunded order:', err));
  
  // Send refund confirmation email
  const { EmailService } = await import('@/lib/services/shared/EmailService');
  const emailService = new EmailService();
  
  if (charge.billing_details?.email) {
    await emailService.send({
      to: charge.billing_details.email,
      subject: 'Refund Processed',
      html: `
        <h2>Refund Confirmation</h2>
        <p>Your refund has been processed successfully.</p>
        <p><strong>Amount:</strong> $${(charge.amount_refunded / 100).toFixed(2)}</p>
        <p>The refund will appear in your account within 5-10 business days.</p>
      `,
    }).catch(err => console.error('Failed to send refund email:', err));
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const eventId = session.metadata?.eventId;
  
  if (!userId || !eventId) return;

  const order = await prisma.order.create({
    data: {
      userId,
      eventId,
      orderNumber: `ORD-${Date.now()}`,
      status: 'COMPLETED',
      subtotal: (session.amount_subtotal || 0) / 100,
      total: (session.amount_total || 0) / 100,
      currency: session.currency?.toUpperCase() || 'USD',
      paymentIntent: session.payment_intent as string,
      paymentMethod: 'card',
      tax: 0,
      fees: 0,
    },
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const event = eventId ? await prisma.event.findUnique({ where: { id: eventId } }) : null;

  if (user && event) {
    await sendEmail({
      to: user.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      templateId: process.env.SENDGRID_ORDER_CONFIRMATION_TEMPLATE_ID,
      dynamicData: { 
        orderNumber: order.orderNumber,
        total: order.total,
        eventName: event.name,
        eventDate: event.startDate
      },
    });
  }
}

async function handleAccountUpdated(account: Stripe.Account) {
  console.log('Connect account updated:', account.id);
  // Update organization with Stripe account - metadata query not supported in Prisma
}
