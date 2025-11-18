/**
 * React Query hooks for ATLVS Tasks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskStatus, Priority } from '@prisma/client';

export interface TaskFilters {
  projectId?: string;
  assigneeId?: string;
  createdBy?: string;
  status?: TaskStatus;
  priority?: Priority;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateTaskData {
  projectId?: string;
  title: string;
  description?: string;
  priority?: Priority;
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string;
  dueDate?: string;
  startDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface CreateTimeEntryData {
  description?: string;
  hours: number;
  date: string;
  billable?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Hook to fetch list of tasks
 */
export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.assigneeId) params.append('assigneeId', filters.assigneeId);
      if (filters.createdBy) params.append('createdBy', filters.createdBy);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/atlvs/tasks?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to fetch a single task by ID
 */
export function useTask(id: string) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const response = await fetch(`/api/atlvs/tasks/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskData) => {
      const response = await fetch('/api/atlvs/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create task');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook to update a task
 */
export function useUpdateTask(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTaskData) => {
      const response = await fetch(`/api/atlvs/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update task');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook to complete a task
 */
export function useCompleteTask(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/atlvs/tasks/${id}/complete`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to complete task');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/atlvs/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete task');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

/**
 * Hook to add time entry to a task
 */
export function useAddTimeEntry(taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTimeEntryData) => {
      const response = await fetch(`/api/atlvs/tasks/${taskId}/time-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add time entry');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
    },
  });
}

/**
 * Hook to fetch task dependencies
 */
export function useTaskDependencies(taskId?: string) {
  return useQuery({
    queryKey: ['taskDependencies', taskId],
    queryFn: async () => {
      const url = taskId 
        ? `/api/atlvs/tasks/${taskId}/dependencies`
        : '/api/atlvs/tasks/dependencies';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch task dependencies');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to fetch time entries
 */
export function useTimeEntries(filters: { taskId?: string; userId?: string; startDate?: string; endDate?: string } = {}) {
  return useQuery({
    queryKey: ['timeEntries', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      if (filters.taskId) params.append('taskId', filters.taskId);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/atlvs/tasks/time-entries?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch time entries');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to fetch task templates
 */
export function useTaskTemplates() {
  return useQuery({
    queryKey: ['atlvs', 'task-templates'],
    queryFn: async () => {
      const response = await fetch('/api/atlvs/tasks/templates');
      if (!response.ok) throw new Error('Failed to fetch task templates');
      return response.json();
    },
    staleTime: 1000 * 60 * 10,
  });
}
