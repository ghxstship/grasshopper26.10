import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useReportPresets() {
  return useQuery({
    queryKey: ['atlvs', 'report-presets'],
    queryFn: async () => {
      const response = await fetch('/api/atlvs/analytics/report-presets');
      if (!response.ok) throw new Error('Failed to fetch report presets');
      return response.json();
    },
  });
}

export function useCategoryPresets(category?: string) {
  return useQuery({
    queryKey: ['atlvs', 'report-presets', 'category', category],
    queryFn: async () => {
      const url = category 
        ? `/api/atlvs/analytics/report-presets?category=${category}`
        : '/api/atlvs/analytics/report-presets';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch category presets');
      return response.json();
    },
    enabled: !!category,
  });
}

export function useFavoriteReports() {
  return useQuery({
    queryKey: ['atlvs', 'report-presets', 'favorites'],
    queryFn: async () => {
      const response = await fetch('/api/atlvs/analytics/report-presets/favorites');
      if (!response.ok) throw new Error('Failed to fetch favorite reports');
      return response.json();
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ presetId, isFavorite }: { presetId: string; isFavorite: boolean }) => {
      const response = await fetch(`/api/atlvs/analytics/report-presets/${presetId}/favorite`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atlvs', 'report-presets'] });
      queryClient.invalidateQueries({ queryKey: ['atlvs', 'report-presets', 'favorites'] });
    },
  });
}
