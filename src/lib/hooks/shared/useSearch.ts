/**
 * React Query hooks for Global Search
 */

import { useQuery } from '@tanstack/react-query';

export function useSearch(query: string, type?: string) {
  return useQuery({
    queryKey: ['search', query, type],
    queryFn: async () => {
      const params = new URLSearchParams({ query });
      if (type) params.append('type', type);
      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) throw new Error('Failed to search');
      return response.json();
    },
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSearchEvents(query: string) {
  return useQuery({
    queryKey: ['search-events', query],
    queryFn: async () => {
      const response = await fetch(`/api/search/events?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search events');
      return response.json();
    },
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['search-users', query],
    queryFn: async () => {
      const response = await fetch(`/api/search/users?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search users');
      return response.json();
    },
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5,
  });
}
