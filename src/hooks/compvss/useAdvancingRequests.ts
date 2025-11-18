/**
 * Advancing Requests Hook
 * Fetches and manages advancing requests with error handling and optimistic updates
 * 
 * @param filters - Optional filters for status, category, priority
 * @returns Advancing requests data with loading/error states and mutation functions
 * 
 * @example
 * ```tsx
 * const { requests, isLoading, error, optimisticUpdate, refresh } = useAdvancingRequests({
 *   status: 'pending',
 *   category: 'access'
 * });
 * ```
 */

import useSWR from 'swr';
import { useCallback } from 'react';

export interface AdvancingRequest {
  id: string;
  userId: string;
  eventId?: string;
  category: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  submittedAt: string;
  reviewedAt?: string;
  approvedAt?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
});

export function useAdvancingRequests(filters?: {
  status?: string;
  category?: string;
  priority?: string;
}) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    `/api/compvss/advancing?${params}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('Error fetching advancing requests:', err);
      },
    }
  );

  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  const optimisticUpdate = useCallback(
    (updatedRequest: AdvancingRequest) => {
      if (!data) return;

      mutate(
        {
          ...data,
          requests: data.requests.map((req: AdvancingRequest) =>
            req.id === updatedRequest.id ? updatedRequest : req
          ),
        },
        false
      );
    },
    [data, mutate]
  );

  const optimisticDelete = useCallback(
    (requestId: string) => {
      if (!data) return;

      mutate(
        {
          ...data,
          requests: data.requests.filter((req: AdvancingRequest) => req.id !== requestId),
          pagination: data.pagination ? {
            ...data.pagination,
            total: data.pagination.total - 1,
          } : undefined,
        },
        false
      );
    },
    [data, mutate]
  );

  const optimisticAdd = useCallback(
    (newRequest: AdvancingRequest) => {
      if (!data) return;

      mutate(
        {
          ...data,
          requests: [newRequest, ...data.requests],
          pagination: data.pagination ? {
            ...data.pagination,
            total: data.pagination.total + 1,
          } : undefined,
        },
        false
      );
    },
    [data, mutate]
  );

  return {
    data,
    requests: data?.requests,
    pagination: data?.pagination,
    isLoading,
    isValidating,
    error: error as Error | undefined,
    isError: !!error,
    refetch: mutate,
    mutate,
    refresh,
    optimisticUpdate,
    optimisticDelete,
    optimisticAdd,
  };
}
