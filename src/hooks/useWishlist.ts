import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface WishlistItem {
  id: string;
  eventId: string;
  createdAt: string;
}

interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
}

export function useWishlist(wishlistId?: string) {
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!wishlistId) return;

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<Wishlist>(`/api/wishlists/${wishlistId}`);
        if (response.data) {
          setWishlist(response.data);
        }
      } catch (err) {
        setError('Failed to fetch wishlist');
        console.error('Failed to fetch wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [wishlistId]);

  const addItem = async (eventId: string) => {
    if (!wishlistId) return;
    try {
      await apiClient.post(`/api/wishlists/${wishlistId}/items`, { eventId });
      // Refresh wishlist
      const response = await apiClient.get<Wishlist>(`/api/wishlists/${wishlistId}`);
      if (response.data) {
        setWishlist(response.data);
      }
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  return { wishlist, loading, error, addItem };
}
