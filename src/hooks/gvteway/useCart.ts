/**
 * Cart Hook
 * Manages shopping cart state and operations
 */

import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCart() {
  const { data, error, mutate, isLoading } = useSWR<Cart>(
    '/api/cart',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  const addItem = useMutation({
    mutationFn: async (item: { productId: string; quantity: number }) => {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) throw new Error('Failed to add item');
      return res.json();
    },
    onSuccess: () => mutate(),
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const res = await fetch(`/api/cart/items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error('Failed to update item');
      return res.json();
    },
    onSuccess: () => mutate(),
  });

  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cart/items/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove item');
      return res.json();
    },
    onSuccess: () => mutate(),
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to clear cart');
      return res.json();
    },
    onSuccess: () => mutate(),
  });

  return {
    cart: data,
    isLoading,
    isError: error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    mutate,
  };
}
