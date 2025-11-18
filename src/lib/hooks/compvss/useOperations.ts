/**
 * React Query hooks for COMPVSS Operations
 */

import { useQuery } from '@tanstack/react-query';

export function useOperationsSchedule() {
  return useQuery({
    queryKey: ['compvss', 'operations', 'schedule'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/operations/schedule');
      if (!response.ok) throw new Error('Failed to fetch schedule');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useOperationsZones() {
  return useQuery({
    queryKey: ['compvss', 'operations', 'zones'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/operations/zones');
      if (!response.ok) throw new Error('Failed to fetch zones');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useOperationsReports() {
  return useQuery({
    queryKey: ['compvss', 'operations', 'reports'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/operations/reports');
      if (!response.ok) throw new Error('Failed to fetch reports');
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useDayOfShow() {
  return useQuery({
    queryKey: ['compvss', 'day-of-show'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/day-of-show');
      if (!response.ok) throw new Error('Failed to fetch day-of-show data');
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds for live updates
  });
}

export function useCompvssSchedule() {
  return useQuery({
    queryKey: ['compvss', 'schedule'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/schedule');
      if (!response.ok) throw new Error('Failed to fetch schedule');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCompvssTasks() {
  return useQuery({
    queryKey: ['compvss', 'tasks'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return response.json();
    },
    staleTime: 1000 * 60 * 2,
  });
}
