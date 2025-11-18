/**
 * Venues Hook
 * Fetches venue information and events
 */

import useSWR from 'swr';

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  capacity: number;
  description: string;
  amenities: string[];
  images: string[];
  upcomingEvents: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useVenues(filters?: { search?: string; city?: string }) {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.city) params.append('city', filters.city);

  const { data, error, mutate, isLoading } = useSWR<{
    venues: Venue[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/api/venues?${params}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  return {
    venues: data?.venues,
    pagination: data?.pagination,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useVenue(id: string) {
  const { data, error, mutate, isLoading } = useSWR<Venue>(
    id ? `/api/venues/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    venue: data,
    isLoading,
    isError: error,
    mutate,
  };
}
