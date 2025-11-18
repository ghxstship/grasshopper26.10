import { useState, useCallback } from 'react';

export interface CheckoutItem {
  priceId: string;
  quantity: number;
}

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCheckout = useCallback(
    async (items: CheckoutItem[], metadata?: Record<string, string>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, metadata }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Checkout failed');
        }

        const result = await response.json();
        
        // Redirect to Stripe checkout
        if (result.url) {
          window.location.href = result.url;
        }

        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    createCheckout,
    isLoading,
    error,
  };
}
