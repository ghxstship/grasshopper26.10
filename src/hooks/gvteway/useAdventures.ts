/**
 * Adventures Hook
 * Fetches VIP experiences and adventure bookings
 */

import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface Adventure {
  id: string;
  title: string;
  description: string;
  type: 'VIP' | 'MEET_GREET' | 'TOUR' | 'BACKSTAGE';
  price: number;
  capacity: number;
  availableSpots: number;
  eventId: string;
  eventName: string;
  date: string;
  venue: string;
  images: string[];
  features: string[];
  createdAt: string;
}

export interface Booking {
  id: string;
  adventureId: string;
  adventureTitle: string;
  eventName: string;
  date: string;
  venue: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  price: number;
  createdAt: string;
}

export interface AdventureFilters {
  type?: string;
  eventId?: string;
  search?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAdventures(filters?: AdventureFilters) {
  const params = new URLSearchParams();
  
  if (filters?.type) params.append('type', filters.type);
  if (filters?.eventId) params.append('eventId', filters.eventId);
  if (filters?.search) params.append('search', filters.search);

  const { data, error, mutate, isLoading } = useSWR<{
    adventures: Adventure[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/api/adventures?${params}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    adventures: data?.adventures,
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useAdventure(id: string) {
  const { data, error, mutate, isLoading } = useSWR<Adventure>(
    id ? `/api/adventures/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    adventure: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useBookings() {
  const { data, error, mutate, isLoading } = useSWR<{
    bookings: Booking[];
  }>('/api/adventures/bookings', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });

  return {
    bookings: data?.bookings,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useBookAdventure() {
  return useMutation({
    mutationFn: async ({ adventureId, quantity }: { adventureId: string; quantity: number }) => {
      const res = await fetch(`/api/adventures/${adventureId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error('Failed to book adventure');
      return res.json();
    },
  });
}
