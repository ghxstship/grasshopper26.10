/**
 * Purchase Ticket Mutation Hook
 * Handles ticket purchase flow
 */

import { useState, useCallback } from 'react';
import { useTickets } from './useTickets';

export interface PurchaseTicketData {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  paymentMethodId?: string;
}

export function usePurchaseTicket() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useTickets();

  const purchaseTicket = useCallback(
    async (data: PurchaseTicketData) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Purchase failed');
        }

        const result = await response.json();
        
        // Revalidate tickets cache
        mutate();

        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return {
    purchaseTicket,
    isLoading,
    error,
  };
}
