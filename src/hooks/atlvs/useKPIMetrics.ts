import { useQuery } from '@tanstack/react-query';

interface KPIMetric {
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  metric_category: string;
}

export function useKPIMetrics(eventId: string) {
  return useQuery({
    queryKey: ['kpi-metrics', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/kpi/event/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch KPI metrics');
      }
      return response.json() as Promise<KPIMetric[]>;
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useKPIDashboard(eventId: string) {
  return useQuery({
    queryKey: ['kpi-dashboard', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/kpi/dashboard/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch KPI dashboard');
      }
      return response.json();
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFinancialKPIs(eventId: string) {
  return useQuery({
    queryKey: ['financial-kpis', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/kpi/financial/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch financial KPIs');
      }
      return response.json();
    },
    enabled: !!eventId,
  });
}

export function useOperationalKPIs(projectId: string) {
  return useQuery({
    queryKey: ['operational-kpis', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/kpi/operational/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch operational KPIs');
      }
      return response.json();
    },
    enabled: !!projectId,
  });
}

export function useMarketingKPIs(eventId: string) {
  return useQuery({
    queryKey: ['marketing-kpis', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/kpi/marketing/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch marketing KPIs');
      }
      return response.json();
    },
    enabled: !!eventId,
  });
}
