import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface Alert {
  id: string;
  title: string;
  description?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  time: string;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAlerts(filters?: { status?: string; severity?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading } = useSWR(
    `/api/compvss/alerts?${params}`,
    fetcher
  );

  return {
    alerts: data?.alerts,
    stats: data?.stats,
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useAcknowledgeAlert() {
  return useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/compvss/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to acknowledge alert');
      return response.json();
    },
  });
}

export function useResolveAlert() {
  return useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/compvss/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to resolve alert');
      return response.json();
    },
  });
}
