/**
 * React Query hooks for GVTEWAY Tickets
 * Provides data fetching, caching, and state management for tickets
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ticket } from '@prisma/client';

export interface TicketFilters {
  eventId?: string;
  userId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TicketsResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch all tickets with filters
 */
export function useTickets(filters: TicketFilters = {}) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: async (): Promise<TicketsResponse> => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/tickets?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Fetch single ticket by ID
 */
export function useTicket(id: string | undefined) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async (): Promise<Ticket> => {
      if (!id) throw new Error('Ticket ID is required');

      const response = await fetch(`/api/tickets/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch ticket');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Purchase tickets
 */
export function usePurchaseTickets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { eventId: string; ticketTypeId: string; quantity: number }) => {
      const response = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to purchase tickets');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

/**
 * Transfer ticket
 */
export function useTransferTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, email }: { id: string; email: string }) => {
      const response = await fetch(`/api/tickets/${id}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to transfer ticket');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
    },
  });
}

/**
 * Validate ticket (check-in)
 */
export function useValidateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tickets/${id}/validate`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to validate ticket');
      }

      return response.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
    },
  });
}

/**
 * Request ticket refund
 */
export function useRefundTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tickets/${id}/refund`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to refund ticket');
      }

      return response.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
    },
  });
}
