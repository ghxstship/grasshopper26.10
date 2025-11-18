/**
 * Stripe Payment Hook
 * Provides payment processing functionality for tickets, products, and memberships
 */

import { useState, useCallback } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

export interface PaymentData {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      throw new Error('Stripe publishable key not found');
    }
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

export function useStripePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = useCallback(async (
    paymentData: PaymentData,
    elements: StripeElements
  ): Promise<PaymentResult> => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Create payment intent via API
      const response = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paymentData.amount,
          currency: paymentData.currency || 'usd',
          description: paymentData.description,
          metadata: paymentData.metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await response.json();

      // Confirm payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/gvteway/tickets/success`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        return { success: false, error: confirmError.message };
      }

      setLoading(false);
      return { success: true, paymentIntentId };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const createSetupIntent = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/setup-intent', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create setup intent');
      }

      const data = await response.json();
      setLoading(false);
      return data.clientSecret;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Setup intent creation failed';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const attachPaymentMethod = useCallback(async (paymentMethodId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/attach-payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId }),
      });

      if (!response.ok) {
        throw new Error('Failed to attach payment method');
      }

      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to attach payment method';
      setError(errorMessage);
      setLoading(false);
      return false;
    }
  }, []);

  return {
    loading,
    error,
    processPayment,
    createSetupIntent,
    attachPaymentMethod,
    getStripe,
  };
}

export function useTicketPurchase() {
  const { processPayment, loading, error } = useStripePayment();

  const purchaseTickets = useCallback(async (
    eventId: string,
    ticketTypeId: string,
    quantity: number,
    elements: StripeElements
  ): Promise<PaymentResult> => {
    try {
      // Calculate total amount
      const response = await fetch(`/api/events/${eventId}/tickets/${ticketTypeId}`);
      const ticketType = await response.json();
      const amount = ticketType.price * quantity * 100; // Convert to cents

      return await processPayment(
        {
          amount,
          currency: 'usd',
          description: `${quantity} ticket(s) for event`,
          metadata: {
            eventId,
            ticketTypeId,
            quantity: quantity.toString(),
          },
        },
        elements
      );
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Ticket purchase failed',
      };
    }
  }, [processPayment]);

  return {
    purchaseTickets,
    loading,
    error,
  };
}

export function useMembershipPurchase() {
  const { processPayment, loading, error } = useStripePayment();

  const purchaseMembership = useCallback(async (
    tierId: string,
    elements: StripeElements
  ): Promise<PaymentResult> => {
    try {
      const response = await fetch(`/api/memberships/tiers/${tierId}`);
      const tier = await response.json();
      const amount = tier.price * 100; // Convert to cents

      return await processPayment(
        {
          amount,
          currency: 'usd',
          description: `${tier.name} membership`,
          metadata: {
            tierId,
            type: 'membership',
          },
        },
        elements
      );
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Membership purchase failed',
      };
    }
  }, [processPayment]);

  return {
    purchaseMembership,
    loading,
    error,
  };
}
