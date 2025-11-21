import { useState } from 'react';

interface CheckoutItem {
  type: 'ticket' | 'product' | 'adventure';
  itemId: string;
  quantity: number;
  price: number;
}

interface CheckoutData {
  items: CheckoutItem[];
  eventId?: string;
  metadata?: Record<string, any>;
}

export function useCheckout() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateCheckout = async (data: CheckoutData) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const orderResult = await orderResponse.json();

      if (!orderResponse.ok || !orderResult.success) {
        throw new Error(orderResult.error?.message || 'Failed to create order');
      }

      const { order } = orderResult.data;

      // Create checkout session
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
        }),
      });

      const checkoutResult = await checkoutResponse.json();

      if (!checkoutResponse.ok || !checkoutResult.success) {
        throw new Error(checkoutResult.error?.message || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const { sessionUrl } = checkoutResult.data;
      if (!sessionUrl) {
        throw new Error('No checkout session URL returned');
      }

      // Redirect to Stripe Checkout page
      window.location.href = sessionUrl;

      return order;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmPayment = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/confirm`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Payment confirmation failed');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Confirmation failed';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    initiateCheckout,
    confirmPayment,
    isProcessing,
    error,
  };
}
