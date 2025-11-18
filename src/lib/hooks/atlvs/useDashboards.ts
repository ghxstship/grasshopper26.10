import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  layout: unknown;
  widgets: unknown[];
  isDefault: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function useDashboards() {
  return useQuery({
    queryKey: ['dashboards'],
    queryFn: async () => {
      const response = await fetch('/api/atlvs/analytics/dashboards');
      if (!response.ok) throw new Error('Failed to fetch dashboards');
      return response.json() as Promise<Dashboard[]>;
    },
    staleTime: 30000,
  });
}

export function useDashboard(id: string) {
  return useQuery({
    queryKey: ['dashboards', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/analytics/dashboards/${id}`);
      if (!response.ok) throw new Error('Failed to fetch dashboard');
      return response.json() as Promise<Dashboard>;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useCreateDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Dashboard>) => {
      const response = await fetch('/api/atlvs/analytics/dashboards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create dashboard');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
}

export function useUpdateDashboard(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Dashboard>) => {
      const response = await fetch(`/api/atlvs/analytics/dashboards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update dashboard');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      queryClient.invalidateQueries({ queryKey: ['dashboards', id] });
    },
  });
}

export function useDeleteDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/analytics/dashboards/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete dashboard');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboards'] });
    },
  });
}
