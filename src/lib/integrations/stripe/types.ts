/**
 * Stripe integration types
 */

import Stripe from 'stripe';

export interface StripeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  apiVersion: string;
}

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  customerId?: string;
  metadata?: Record<string, string>;
  description?: string;
  paymentMethodTypes?: string[];
}

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  quantity?: number;
  trialPeriodDays?: number;
  metadata?: Record<string, string>;
}

export interface CreateConnectAccountParams {
  type: 'express' | 'standard' | 'custom';
  email: string;
  country: string;
  capabilities?: {
    card_payments?: { requested: boolean };
    transfers?: { requested: boolean };
  };
  businessType?: 'individual' | 'company';
  metadata?: Record<string, string>;
}

export interface CreateAccountLinkParams {
  accountId: string;
  refreshUrl: string;
  returnUrl: string;
  type: 'account_onboarding' | 'account_update';
}

export interface CreateTransferParams {
  amount: number;
  currency: string;
  destination: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface CreateRefundParams {
  paymentIntentId: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionParams {
  lineItems: Array<{
    price: string;
    quantity: number;
  }>;
  mode: 'payment' | 'subscription' | 'setup';
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Stripe.Event.Data.Object;
  };
  created: number;
}

export type StripeEventType =
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'charge.refunded'
  | 'checkout.session.completed'
  | 'account.updated'
  | 'transfer.created'
  | 'payout.paid'
  | 'payout.failed';
