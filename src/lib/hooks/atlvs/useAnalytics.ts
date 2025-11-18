/**
 * React Query hooks for ATLVS Analytics
 */

import { useQuery } from '@tanstack/react-query';

export function useAnalyticsDashboards() {
  return useQuery({
    queryKey: ['analytics-dashboards'],
    queryFn: async () => {
      const response = await fetch('/api/atlvs/analytics/dashboards');
      if (!response.ok) throw new Error('Failed to fetch dashboards');
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useAnalyticsReports(filters = {}) {
  return useQuery({
    queryKey: ['analytics-reports', filters],
    queryFn: async () => {
      const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]));
      const response = await fetch(`/api/atlvs/analytics/reports?${params}`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAnalyticsInsights(projectId?: string) {
  return useQuery({
    queryKey: ['analytics-insights', projectId],
    queryFn: async () => {
      const params = projectId ? `?projectId=${projectId}` : '';
      const response = await fetch(`/api/atlvs/analytics/insights${params}`);
      if (!response.ok) throw new Error('Failed to fetch insights');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProjectAnalytics(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project-analytics', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID required');
      const response = await fetch(`/api/atlvs/projects/${projectId}/analytics`);
      if (!response.ok) throw new Error('Failed to fetch project analytics');
      return response.json();
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });
}

// General analytics hook (alias for useAnalyticsDashboards)
export const useAnalytics = useAnalyticsDashboards;
