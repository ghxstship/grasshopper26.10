/**
 * Payment Service
 * Centralized payment processing via Stripe
 */

import Stripe from 'stripe';
import { getStripeClient } from '@/lib/integrations/stripe';

export class PaymentService {
  /**
   * Create payment intent
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata?: Record<string, string>
  ) {
    try {
      const stripe = getStripeClient();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Confirm payment intent
   */
  async confirmPaymentIntent(paymentIntentId: string) {
    try {
      const stripe = getStripeClient();
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

      return {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        paymentIntent,
      };
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get payment intent
   */
  async getPaymentIntent(paymentIntentId: string) {
    try {
      const stripe = getStripeClient();
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        success: true,
        paymentIntent,
      };
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Cancel payment intent
   */
  async cancelPaymentIntent(paymentIntentId: string) {
    try {
      const stripe = getStripeClient();
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

      return {
        success: true,
        paymentIntent,
      };
    } catch (error) {
      console.error('Error canceling payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create customer
   */
  async createCustomer(email: string, name?: string, metadata?: Record<string, string>) {
    try {
      const stripe = getStripeClient();
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: metadata || {},
      });

      return {
        success: true,
        customerId: customer.id,
        customer,
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get customer
   */
  async getCustomer(customerId: string) {
    try {
      const stripe = getStripeClient();
      const customer = await stripe.customers.retrieve(customerId);

      return {
        success: true,
        customer,
      };
    } catch (error) {
      console.error('Error retrieving customer:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create subscription
   */
  async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>
  ) {
    try {
      const stripe = getStripeClient();
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata: metadata || {},
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice | null;
      const paymentIntent = latestInvoice && typeof latestInvoice === 'object' && 'payment_intent' in latestInvoice
        ? (latestInvoice.payment_intent as Stripe.PaymentIntent)
        : null;

      return {
        success: true,
        subscriptionId: subscription.id,
        subscription,
        clientSecret: paymentIntent?.client_secret || null,
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, immediately = false) {
    try {
      const stripe = getStripeClient();
      const subscription = immediately
        ? await stripe.subscriptions.cancel(subscriptionId)
        : await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
          });

      return {
        success: true,
        subscription,
      };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create refund
   */
  async createRefund(paymentIntentId: string, amount?: number, reason?: string) {
    try {
      const stripe = getStripeClient();
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason as Stripe.RefundCreateParams.Reason | undefined,
      });

      return {
        success: true,
        refundId: refund.id,
        refund,
      };
    } catch (error) {
      console.error('Error creating refund:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get refund
   */
  async getRefund(refundId: string) {
    try {
      const stripe = getStripeClient();
      const refund = await stripe.refunds.retrieve(refundId);

      return {
        success: true,
        refund,
      };
    } catch (error) {
      console.error('Error retrieving refund:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create checkout session
   */
  async createCheckoutSession(
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ) {
    try {
      const stripe = getStripeClient();
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: metadata || {},
      });

      return {
        success: true,
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Construct webhook event
   */
  constructWebhookEvent(payload: string, signature: string, secret: string) {
    try {
      const stripe = getStripeClient();
      const event = stripe.webhooks.constructEvent(payload, signature, secret);
      return { success: true, event };
    } catch (error) {
      console.error('Error constructing webhook event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const paymentService = new PaymentService();
