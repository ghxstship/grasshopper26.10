/**
 * Stripe Webhook Handler Edge Function
 * Processes Stripe webhook events for payment processing
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@19.3.1?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';
import { handleCorsPreFlight } from '../_shared/cors.ts';
import { successResponse, errorResponse, handleError } from '../_shared/response.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return handleCorsPreFlight();
  }

  try {
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return errorResponse('INVALID_REQUEST', 'Missing stripe-signature header', 400);
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'COMPLETED',
            paymentIntentId: paymentIntent.id,
            paidAt: new Date().toISOString(),
          })
          .eq('paymentIntentId', paymentIntent.id);

        if (error) {
          console.error('Failed to update order:', error);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order status
        const { error } = await supabase
          .from('orders')
          .update({
            status: 'FAILED',
            paymentIntentId: paymentIntent.id,
          })
          .eq('paymentIntentId', paymentIntent.id);

        if (error) {
          console.error('Failed to update order:', error);
        }

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        
        // Create refund record
        const { error } = await supabase
          .from('refunds')
          .insert({
            chargeId: charge.id,
            amount: charge.amount_refunded,
            status: 'COMPLETED',
            processedAt: new Date().toISOString(),
          });

        if (error) {
          console.error('Failed to create refund record:', error);
        }

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            stripeSubscriptionId: subscription.id,
            customerId: subscription.customer as string,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          });

        if (error) {
          console.error('Failed to update subscription:', error);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return successResponse({ received: true, eventType: event.type });
  } catch (error) {
    return handleError(error);
  }
});
