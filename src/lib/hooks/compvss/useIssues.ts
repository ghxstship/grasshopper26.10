/**
 * React Query hooks for COMPVSS Issues
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useIssues(filters = {}) {
  return useQuery({
    queryKey: ['issues', filters],
    queryFn: async () => {
      const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]));
      const response = await fetch(`/api/compvss/issues?${params}`);
      if (!response.ok) throw new Error('Failed to fetch issues');
      return response.json();
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useIssue(id: string | undefined) {
  return useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      if (!id) throw new Error('Issue ID required');
      const response = await fetch(`/api/compvss/issues/${id}`);
      if (!response.ok) throw new Error('Failed to fetch issue');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/compvss/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create issue');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
  });
}

export function useResolveIssue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, resolution }: { id: string; resolution: string }) => {
      const response = await fetch(`/api/compvss/issues/${id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution }),
      });
      if (!response.ok) throw new Error('Failed to resolve issue');
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', id] });
    },
  });
}
