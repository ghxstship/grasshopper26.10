import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Report {
  id: string;
  name: string;
  type: 'project' | 'budget' | 'team' | 'asset';
  description?: string;
  schedule?: string;
  format?: string;
  period?: string;
  generated?: string;
  size?: string;
  recipients?: string[];
  filters?: Record<string, unknown>;
  lastRun?: Date;
  nextRun?: Date;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

interface ReportFilters {
  type?: string;
  status?: string;
  search?: string;
}

export function useReports(filters?: ReportFilters) {
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const response = await fetch(`/api/atlvs/analytics/reports?${params}`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      return response.json() as Promise<Report[]>;
    },
    staleTime: 30000,
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/analytics/reports/${id}`);
      if (!response.ok) throw new Error('Failed to fetch report');
      return response.json() as Promise<Report>;
    },
    enabled: !!id,
    staleTime: 30000,
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Report>) => {
      const response = await fetch('/api/atlvs/analytics/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useUpdateReport(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Report>) => {
      const response = await fetch(`/api/atlvs/analytics/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update report');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['reports', id] });
    },
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/analytics/reports/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete report');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
