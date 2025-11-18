import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Alert {
  id: string;
  type: 'artist' | 'venue' | 'genre' | 'event';
  name: string;
  criteria: string;
  active: boolean;
  createdAt: Date;
}

export interface CreateAlertInput {
  type: Alert['type'];
  name: string;
  criteria: string;
}

/**
 * Hook for managing user alerts
 */
export function useAlerts() {
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading, error, refetch } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      const response = await fetch('/api/gvteway/alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      return data.alerts || [];
    },
  });

  const createAlert = useMutation({
    mutationFn: async (input: CreateAlertInput) => {
      const response = await fetch('/api/gvteway/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error('Failed to create alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const updateAlert = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const response = await fetch(`/api/gvteway/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });
      if (!response.ok) throw new Error('Failed to update alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/gvteway/alerts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete alert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  return {
    alerts,
    isLoading,
    error,
    refetch,
    createAlert: createAlert.mutate,
    updateAlert: updateAlert.mutate,
    deleteAlert: deleteAlert.mutate,
    isCreating: createAlert.isPending,
    isUpdating: updateAlert.isPending,
    isDeleting: deleteAlert.isPending,
  };
}
