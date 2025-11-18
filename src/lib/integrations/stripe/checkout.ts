import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});

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

  const session = await stripe.checkout.sessions.create({
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
  return await stripe.checkout.sessions.retrieve(sessionId);
}

export async function createRefund(paymentIntentId: string, amount?: number) {
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
  });
}

export async function createCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
  });
}

export async function createSubscription(customerId: string, priceId: string) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  });
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}
