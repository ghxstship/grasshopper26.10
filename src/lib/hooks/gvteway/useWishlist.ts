/**
 * React Query hooks for GVTEWAY Wishlist
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useWishlists() {
  return useQuery({
    queryKey: ['wishlists'],
    queryFn: async () => {
      const response = await fetch('/api/wishlists');
      if (!response.ok) throw new Error('Failed to fetch wishlists');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await fetch('/api/wishlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create wishlist');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlists'] }),
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ wishlistId, eventId }: { wishlistId: string; eventId: string }) => {
      const response = await fetch(`/api/wishlists/${wishlistId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });
      if (!response.ok) throw new Error('Failed to add to wishlist');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlists'] }),
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ wishlistId, itemId }: { wishlistId: string; itemId: string }) => {
      const response = await fetch(`/api/wishlists/${wishlistId}/items/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlists'] }),
  });
}
