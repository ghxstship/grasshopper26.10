/**
 * Analytics Data Hooks
 * React Query hooks for analytics and reporting data
 */

import { useQuery, useMutation } from '@tanstack/react-query';

// Types
export interface AnalyticsMetrics {
  totalRevenue: number;
  revenueChange: number;
  activeProjects: number;
  projectsChange: number;
  teamMembers: number;
  membersChange: number;
  budgetUtilization: number;
  budgetChange: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
}

export interface ProjectDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface TeamPerformance {
  id: string;
  name: string;
  projects: number;
  completion: number;
  budget: number;
}

export interface AnalyticsFilters {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  projectId?: string;
  teamId?: string;
}

// API Functions
async function fetchAnalyticsMetrics(filters: AnalyticsFilters): Promise<AnalyticsMetrics> {
  const params = new URLSearchParams();
  if (filters.timeRange) params.append('timeRange', filters.timeRange);
  if (filters.projectId) params.append('projectId', filters.projectId);
  if (filters.teamId) params.append('teamId', filters.teamId);

  const response = await fetch(`/api/atlvs/analytics/metrics?${params}`);
  if (!response.ok) throw new Error('Failed to fetch analytics metrics');
  const data = await response.json();
  return data.data;
}

async function fetchRevenueData(filters: AnalyticsFilters): Promise<RevenueData[]> {
  const params = new URLSearchParams();
  if (filters.timeRange) params.append('timeRange', filters.timeRange);

  const response = await fetch(`/api/atlvs/analytics/revenue?${params}`);
  if (!response.ok) throw new Error('Failed to fetch revenue data');
  const data = await response.json();
  return data.data;
}

async function fetchProjectDistribution(filters: AnalyticsFilters): Promise<ProjectDistribution[]> {
  const params = new URLSearchParams();
  if (filters.timeRange) params.append('timeRange', filters.timeRange);

  const response = await fetch(`/api/atlvs/analytics/projects/distribution?${params}`);
  if (!response.ok) throw new Error('Failed to fetch project distribution');
  const data = await response.json();
  return data.data;
}

async function fetchTeamPerformance(filters: AnalyticsFilters): Promise<TeamPerformance[]> {
  const params = new URLSearchParams();
  if (filters.timeRange) params.append('timeRange', filters.timeRange);

  const response = await fetch(`/api/atlvs/analytics/teams/performance?${params}`);
  if (!response.ok) throw new Error('Failed to fetch team performance');
  const data = await response.json();
  return data.data;
}

async function exportReport(filters: AnalyticsFilters & { format: 'pdf' | 'csv' | 'xlsx' }): Promise<Blob> {
  const params = new URLSearchParams();
  if (filters.timeRange) params.append('timeRange', filters.timeRange);
  if (filters.format) params.append('format', filters.format);

  const response = await fetch(`/api/atlvs/analytics/export?${params}`);
  if (!response.ok) throw new Error('Failed to export report');
  return response.blob();
}

// Hooks
export function useAnalyticsMetrics(filters: AnalyticsFilters = {}) {
  return useQuery({
    queryKey: ['analytics', 'metrics', filters],
    queryFn: () => fetchAnalyticsMetrics(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRevenueData(filters: AnalyticsFilters = {}) {
  return useQuery({
    queryKey: ['analytics', 'revenue', filters],
    queryFn: () => fetchRevenueData(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProjectDistribution(filters: AnalyticsFilters = {}) {
  return useQuery({
    queryKey: ['analytics', 'projects', 'distribution', filters],
    queryFn: () => fetchProjectDistribution(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTeamPerformance(filters: AnalyticsFilters = {}) {
  return useQuery({
    queryKey: ['analytics', 'teams', 'performance', filters],
    queryFn: () => fetchTeamPerformance(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExportReport() {
  return useMutation({
    mutationFn: exportReport,
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${Date.now()}.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
}
