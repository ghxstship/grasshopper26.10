/**
 * React Query hooks for ATLVS Time Entries
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface TimeEntryFilters {
  taskId?: string;
  projectId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  billable?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateTimeEntryData {
  taskId: string;
  userId: string;
  description?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  billable?: boolean;
  hourlyRate?: number;
}

export interface UpdateTimeEntryData {
  description?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  billable?: boolean;
  hourlyRate?: number;
}

/**
 * Hook to fetch list of time entries
 */
export function useTimeEntries(filters: TimeEntryFilters = {}) {
  return useQuery({
    queryKey: ['time-entries', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.taskId) params.append('taskId', filters.taskId);
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.billable !== undefined) params.append('billable', filters.billable.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/atlvs/time-entries?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch time entries');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to fetch a single time entry by ID
 */
export function useTimeEntry(id: string) {
  return useQuery({
    queryKey: ['time-entry', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/time-entries/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch time entry');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new time entry
 */
export function useCreateTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTimeEntryData) => {
      const response = await fetch('/api/atlvs/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create time entry');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
    },
  });
}

/**
 * Hook to update a time entry
 */
export function useUpdateTimeEntry(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTimeEntryData) => {
      const response = await fetch(`/api/atlvs/time-entries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update time entry');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entry', id] });
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
    },
  });
}

/**
 * Hook to delete a time entry
 */
export function useDeleteTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/time-entries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete time entry');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
    },
  });
}

/**
 * Hook to start a timer
 */
export function useStartTimer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { taskId: string; userId: string; description?: string }) => {
      const response = await fetch('/api/atlvs/time-entries/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to start timer');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
    },
  });
}

/**
 * Hook to stop a timer
 */
export function useStopTimer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/atlvs/time-entries/${id}/stop`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to stop timer');
      }

      return response.json();
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['time-entry', id] });
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
    },
  });
}

/**
 * Hook to fetch time tracking summary
 */
export function useTimeTrackingSummary(filters: { userId?: string; projectId?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['time-tracking-summary', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/atlvs/time-entries/summary?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch time tracking summary');
      }
      
      return response.json();
    },
  });
}
