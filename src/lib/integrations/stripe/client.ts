/**
 * Stripe client and integration functions
 */

import Stripe from 'stripe';
import { validateEnvVars, createSuccessResponse, createErrorResponse } from '../utils';
import type { IntegrationResponse } from '../types';
import type {
  CreatePaymentIntentParams,
  CreateSubscriptionParams,
  CreateConnectAccountParams,
  CreateAccountLinkParams,
  CreateTransferParams,
  CreateRefundParams,
  CreateCheckoutSessionParams,
} from './types';

// Initialize Stripe client
let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    validateEnvVars({
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    });

    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-10-29.clover',
      typescript: true,
    });
  }

  return stripeClient;
}

/**
 * Create a payment intent
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<IntegrationResponse<Stripe.PaymentIntent>> {
  try {
    const stripe = getStripeClient();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: params.amount,
      currency: params.currency,
      customer: params.customerId,
      metadata: params.metadata,
      description: params.description,
      payment_method_types: params.paymentMethodTypes || ['card'],
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return createSuccessResponse(paymentIntent);
  } catch (error) {
    return createErrorResponse(
      'STRIPE_PAYMENT_INTENT_ERROR',
      error instanceof Error ? error.message : 'Failed to create payment intent',
      error
    );
  }
}

/**
 * Create a customer
 */
export async function createCustomer(
  email: string,
  name?: string,
  metadata?: Record<string, string>
): Promise<IntegrationResponse<Stripe.Customer>> {
  try {
    const stripe = getStripeClient();

    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });

    return createSuccessResponse(customer);
  } catch (error) {
    return createErrorResponse(
      'STRIPE_CUSTOMER_ERROR',
      error instanceof Error ? error.message : 'Failed to create customer',
      error
    );
  }
}

/**
 * Create a subscription
 */
export async function createSubscription(
  params: CreateSubscriptionParams
): Promise<IntegrationResponse<Stripe.Subscription>> {
  try {
    const stripe = getStripeClient();

    const subscription = await stripe.subscriptions.create({
      customer: params.customerId,
      items: [
        {
          price: params.priceId,
          quantity: params.quantity || 1,
        },
      ],
      trial_period_days: params.trialPeriodDays,
      metadata: params.metadata,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    return createSuccessResponse(subscription);
  } catch (error) {
    return createErrorResponse(
      'STRIPE_SUBSCRIPTION_ERROR',
      error instanceof Error ? error.message : 'Failed to create subscription',
      error
    );
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<IntegrationResponse<Stripe.Subscription>> {
  try {
    const stripe = getStripeClient();

    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    return createSuccessResponse(subscription);
  } catch (error) {
    return createErrorResponse(
      'STRIPE_CANCEL_SUBSCRIPTION_ERROR',
      error instanceof Error ? error.message : 'Failed to cancel subscription',
      error
    );
  }
}

/**
 * Create a Connect account
 */
export async function createConnectAccount(
  params: CreateConnectAccountParams
): Promise<IntegrationResponse<Stripe.Account>> {
  try {
    const stripe = getStripeClient();

    const account = await stripe.accounts.create({
      type: params.type,
      email: params.email,
      country: params.country,
      capabilities: params.capabilities,
      business_type: params.businessType,
      metadata: params.metadata,
    });

    return createSuccessResponse(account);
  } catch (error) {
    return createErrorResponse(
      'STRIPE_CONNECT_ACCOUNT_ERROR',
      error instanceof Error ? error.message : 'Failed to create Connect account',
      error
    );
  }
}

/**
 * Create an account link for onboarding
 */
export async function createAccountLink(
  params: CreateAccountLinkParams
): Promise<IntegrationResponse<Stripe.AccountLink>> {
  try {
    const stripe = getStripeClient();

    const accountLink = await stripe.accountLinks.create({
      account: params.accountId,
      refresh_url: params.refreshUrl,
      return_url: params.returnUrl,
      type: params.type,
    });

    return createSuccessResponse(accountLink);
  } catch (error) {
    return createErrorResponse(
      'STRIPE_ACCOUNT_LINK_ERROR',
      error instanceof Error ? error.message : 'Failed to create account link',
      error
    );
  }
}

/**
 * Create a transfer to a Connect account
 */
export async function createTransfer(
  params: CreateTransferParams
): Promise<IntegrationResponse<Stripe.Transfer>> {
  try {
    const stripe = getStripeClient();

    const transfer = await stripe.transfers.create({
      amount: params.amount,
      currency: params.currency,
      destination: params.destination,
      description: params.description,
      metadata: params.metadata,
    });

    return createSuccessResponse(transfer);
  } catch (error) {
    return createErrorResponse(
      'STRIPE_TRANSFER_ERROR',
      error instanceof Error ? error.message : 'Failed to create transfer',
      error
    );
  }
}

/**
 * Create a refund
 */
export async function createRefund(
  params: CreateRefundParams
): Promise<IntegrationResponse<Stripe.Refund>> {
  try {
    const stripe = getStripeClient();

    const refund = await stripe.refunds.create({
      payment_intent: params.paymentIntentId,
      amount: params.amount,
      reason: params.reason,
      metadata: params.metadata,
    });

    return createSuccessResponse(refund);
  } catch (error) {
    return createErrorResponse(
      'STRIPE_REFUND_ERROR',
      error instanceof Error ? error.message : 'Failed to create refund',
      error
    );
  }
}

/**
 * Create a checkout session
 */
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<IntegrationResponse<Stripe.Checkout.Session>> {
  try {
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      line_items: params.lineItems,
      mode: params.mode,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer: params.customerId,
      metadata: params.metadata,
    });

    return createSuccessResponse(session);
  } catch (error) {
    return createErrorResponse(
      'STRIPE_CHECKOUT_SESSION_ERROR',
      error instanceof Error ? error.message : 'Failed to create checkout session',
      error
    );
  }
}

/**
 * Retrieve a payment intent
 */
export async function retrievePaymentIntent(
  paymentIntentId: string
): Promise<IntegrationResponse<Stripe.PaymentIntent>> {
  try {
    const stripe = getStripeClient();

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return createSuccessResponse(paymentIntent);
  } catch (error) {
    return createErrorResponse(
      'STRIPE_RETRIEVE_PAYMENT_INTENT_ERROR',
      error instanceof Error ? error.message : 'Failed to retrieve payment intent',
      error
    );
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event | null {
  try {
    const stripe = getStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}
