/**
 * React Query hooks for COMPVSS Affiliates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useAffiliates(filters = {}) {
  return useQuery({
    queryKey: ['affiliates', filters],
    queryFn: async () => {
      const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]));
      const response = await fetch(`/api/compvss/affiliates?${params}`);
      if (!response.ok) throw new Error('Failed to fetch affiliates');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAffiliate(id: string | undefined) {
  return useQuery({
    queryKey: ['affiliate', id],
    queryFn: async () => {
      if (!id) throw new Error('Affiliate ID required');
      const response = await fetch(`/api/compvss/affiliates/${id}`);
      if (!response.ok) throw new Error('Failed to fetch affiliate');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateAffiliate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/compvss/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create affiliate');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['affiliates'] }),
  });
}

export function useAffiliatePerformance(id: string | undefined) {
  return useQuery({
    queryKey: ['affiliate-performance', id],
    queryFn: async () => {
      if (!id) throw new Error('Affiliate ID required');
      const response = await fetch(`/api/compvss/affiliates/${id}/performance`);
      if (!response.ok) throw new Error('Failed to fetch performance');
      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
