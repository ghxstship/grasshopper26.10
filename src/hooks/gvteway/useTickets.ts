/**
 * Tickets Hook
 * Fetches and manages user tickets with QR codes, error handling, and optimistic updates
 * 
 * @param filters - Optional filters for status and eventId
 * @returns Tickets data with loading/error states and mutation functions
 * 
 * @example
 * ```tsx
 * const { tickets, isLoading, error, optimisticUpdate } = useTickets({
 *   status: 'active',
 *   eventId: 'event-123'
 * });
 * ```
 */

import useSWR from 'swr';
import { useCallback } from 'react';

export interface Ticket {
  id: string;
  qrCode: string;
  status: string;
  seatNumber?: string;
  ticketType: {
    name: string;
    description?: string;
    price: number;
    currency: string;
  };
  event: {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    startDate: string;
    endDate?: string;
    venue?: {
      name: string;
      address: string;
      city: string;
      state?: string;
    };
  };
  order: {
    id: string;
    orderNumber: string;
    status: string;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
});

export function useTickets(filters?: { status?: string; eventId?: string }) {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading, isValidating } = useSWR<{
    tickets: Ticket[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/api/tickets?${params}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    onError: (err) => {
      console.error('Error fetching tickets:', err);
    },
  });

  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  const optimisticUpdate = useCallback(
    (updatedTicket: Ticket) => {
      if (!data) return;

      mutate(
        {
          ...data,
          tickets: data.tickets.map((ticket) =>
            ticket.id === updatedTicket.id ? updatedTicket : ticket
          ),
        },
        false
      );
    },
    [data, mutate]
  );

  const optimisticDelete = useCallback(
    (ticketId: string) => {
      if (!data) return;

      mutate(
        {
          ...data,
          tickets: data.tickets.filter((ticket) => ticket.id !== ticketId),
          pagination: {
            ...data.pagination,
            total: data.pagination.total - 1,
          },
        },
        false
      );
    },
    [data, mutate]
  );

  return {
    tickets: data?.tickets,
    pagination: data?.pagination,
    isLoading,
    isValidating,
    error: error as Error | undefined,
    isError: !!error,
    mutate,
    refresh,
    optimisticUpdate,
    optimisticDelete,
  };
}
