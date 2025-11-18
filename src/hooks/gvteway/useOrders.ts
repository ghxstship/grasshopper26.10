/**
 * Orders Hook
 * Fetches order history and tracking
 */

import useSWR from 'swr';

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  currency: string;
  createdAt: string;
  items: Array<{
    id: string;
    type: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useOrders(filters?: { status?: string }) {
  const params = new URLSearchParams();
  
  if (filters?.status) {
    params.append('status', filters.status);
  }

  const { data, error, mutate, isLoading } = useSWR<{
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/api/orders?${params}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    orders: data?.orders,
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}
