import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ReportPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  kpi_function: string;
  display_format: string;
  unit: string;
  icon: string;
  color: string;
  is_global: boolean;
  is_active: boolean;
}

export function useReportPresets() {
  return useQuery({
    queryKey: ['report-presets'],
    queryFn: async () => {
      const response = await fetch('/api/atlvs/reports/presets');
      if (!response.ok) {
        throw new Error('Failed to fetch report presets');
      }
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - presets don't change often
  });
}

export function useCategoryPresets(category: string) {
  return useQuery({
    queryKey: ['report-presets', category],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/reports/presets/${category}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category presets');
      }
      return response.json() as Promise<ReportPreset[]>;
    },
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFavoriteReports() {
  return useQuery({
    queryKey: ['favorite-reports'],
    queryFn: async () => {
      const response = await fetch('/api/atlvs/reports/favorites');
      if (!response.ok) {
        throw new Error('Failed to fetch favorite reports');
      }
      return response.json();
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ presetId, isFavorite }: { presetId: string; isFavorite: boolean }) => {
      const response = await fetch('/api/atlvs/reports/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preset_id: presetId,
          is_favorite: isFavorite,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite-reports'] });
    },
  });
}
