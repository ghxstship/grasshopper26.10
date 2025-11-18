/**
 * React Query hooks for ATLVS Automation
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useWorkflows(filters = {}) {
  return useQuery({
    queryKey: ['workflows', filters],
    queryFn: async () => {
      const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]));
      const response = await fetch(`/api/atlvs/automation?${params}`);
      if (!response.ok) throw new Error('Failed to fetch workflows');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useWorkflow(id: string | undefined) {
  return useQuery({
    queryKey: ['workflow', id],
    queryFn: async () => {
      if (!id) throw new Error('Workflow ID required');
      const response = await fetch(`/api/atlvs/automation/${id}`);
      if (!response.ok) throw new Error('Failed to fetch workflow');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/atlvs/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create workflow');
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workflows'] }),
  });
}

export function useExecuteWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/automation/${id}/execute`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to execute workflow');
      return response.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['workflow', id] });
      queryClient.invalidateQueries({ queryKey: ['workflow-logs', id] });
    },
  });
}

export function useWorkflowLogs(id: string | undefined) {
  return useQuery({
    queryKey: ['workflow-logs', id],
    queryFn: async () => {
      if (!id) throw new Error('Workflow ID required');
      const response = await fetch(`/api/atlvs/automation/${id}/logs`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return response.json();
    },
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}

// General automation hook (alias for useWorkflows)
export const useAutomation = useWorkflows;
