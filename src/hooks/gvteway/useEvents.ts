/**
 * Events Hook
 * Fetches and caches event listings with filters
 * Includes error handling, loading states, and retry logic
 */

import useSWR from 'swr';
import { useCallback } from 'react';

export interface EventFilters {
  organizationId?: string;
  categoryId?: string;
  venueId?: string;
  status?: string;
  visibility?: string;
  featured?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface Event {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  status: string;
  visibility: string;
  featured: boolean;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  venue?: {
    id: string;
    name: string;
    city: string;
    state?: string;
    country: string;
  };
  artists: Array<{
    id: string;
    name: string;
    imageUrl?: string;
  }>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useEvents(filters?: EventFilters) {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
  }

  const { data, error, mutate, isLoading, isValidating } = useSWR<{
    events: Event[];
    pagination: PaginationMeta;
  }>(`/api/events?${params}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    onError: (err) => {
      console.error('Error fetching events:', err);
    },
  });

  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  const optimisticUpdate = useCallback(
    (updatedEvent: Event) => {
      if (!data) return;

      mutate(
        {
          ...data,
          events: data.events.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          ),
        },
        false
      );
    },
    [data, mutate]
  );

  const optimisticDelete = useCallback(
    (eventId: string) => {
      if (!data) return;

      mutate(
        {
          ...data,
          events: data.events.filter((event) => event.id !== eventId),
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
    events: data?.events,
    pagination: data?.pagination,
    isLoading,
    isValidating,
    isError: !!error,
    error: error as Error | undefined,
    mutate,
    refresh,
    optimisticUpdate,
    optimisticDelete,
  };
}
