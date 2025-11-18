/**
 * React Query hooks for GVTEWAY Orders
 * Provides data fetching, caching, and state management for orders
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, OrderItem, Event, Venue } from '@prisma/client';

export interface OrderWithItems extends Order {
  items: OrderItem[];
  event?: Event & {
    venue?: Venue | null;
  } | null;
}

export interface OrderFilters {
  userId?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OrdersResponse {
  orders: OrderWithItems[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Fetch all orders with filters
 */
export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async (): Promise<OrdersResponse> => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/orders?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

/**
 * Fetch single order by ID
 */
export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async (): Promise<OrderWithItems> => {
      if (!id) throw new Error('Order ID is required');

      const response = await fetch(`/api/orders/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Create new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Order>) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create order');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

/**
 * Update order status
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update order status');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
    },
  });
}

/**
 * Cancel order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/orders/${id}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel order');
      }

      return response.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
    },
  });
}
