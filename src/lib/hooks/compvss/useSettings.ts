import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useSettings() {
  return useQuery({
    queryKey: ['compvss', 'settings'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: any) => {
      const response = await fetch('/api/compvss/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compvss', 'settings'] });
    },
  });
}
