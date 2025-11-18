import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  severity: 'info' | 'warning' | 'error' | 'success';
  status: 'active' | 'resolved' | 'dismissed';
  createdAt: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
}

export function useAlerts(filters?: { status?: string; type?: string }) {
  return useQuery({
    queryKey: ['compvss', 'alerts', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);
      
      const response = await fetch(`/api/compvss/alerts?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      return { alerts: data.alerts || [] };
    },
  });
}

export function useDismissAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/compvss/alerts/${alertId}/dismiss`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to dismiss alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compvss', 'alerts'] });
    },
  });
}
