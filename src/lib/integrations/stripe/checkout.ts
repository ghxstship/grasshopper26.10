import Stripe from 'stripe';

let stripe: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    });
  }
  
  return stripe;
}

export interface CheckoutSessionParams {
  items: Array<{
    priceId: string;
    quantity: number;
  }>;
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export async function createCheckoutSession(params: CheckoutSessionParams) {
  const { items, customerId, successUrl, cancelUrl, metadata } = params;
  const client = getStripeClient();

  const session = await client.checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    line_items: items.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    })),
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
  });

  return session;
}

export async function retrieveCheckoutSession(sessionId: string) {
  const client = getStripeClient();
  return await client.checkout.sessions.retrieve(sessionId);
}

export async function createRefund(paymentIntentId: string, amount?: number) {
  const client = getStripeClient();
  return await client.refunds.create({
    payment_intent: paymentIntentId,
    amount,
  });
}

export async function createCustomer(email: string, name?: string) {
  const client = getStripeClient();
  return await client.customers.create({
    email,
    name,
  });
}

export async function createSubscription(customerId: string, priceId: string) {
  const client = getStripeClient();
  return await client.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  });
}

export async function cancelSubscription(subscriptionId: string) {
  const client = getStripeClient();
  return await client.subscriptions.cancel(subscriptionId);
}
