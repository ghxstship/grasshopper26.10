/**
 * Tasks Hook
 * Fetches and manages ATLVS tasks with error handling and optimistic updates
 * 
 * @param filters - Optional filters for project, status, assignee
 * @returns Tasks data with loading/error states and mutation functions
 * 
 * @example
 * ```tsx
 * const { tasks, isLoading, error, optimisticUpdate } = useTasks({
 *   projectId: 'proj-123',
 *   status: 'in_progress'
 * });
 * ```
 */

import useSWR from 'swr';
import { useCallback } from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigneeId?: string;
  dueDate?: string;
  completedAt?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
});

export function useTasks(filters?: { status?: string; assigneeId?: string; projectId?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    `/api/atlvs/tasks?${params}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('Error fetching tasks:', err);
      },
    }
  );

  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  const optimisticUpdate = useCallback(
    (updatedTask: Task) => {
      if (!data) return;

      mutate(
        {
          ...data,
          tasks: data.tasks.map((task: Task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        },
        false
      );
    },
    [data, mutate]
  );

  const optimisticDelete = useCallback(
    (taskId: string) => {
      if (!data) return;

      mutate(
        {
          ...data,
          tasks: data.tasks.filter((task: Task) => task.id !== taskId),
          pagination: data.pagination ? {
            ...data.pagination,
            total: data.pagination.total - 1,
          } : undefined,
        },
        false
      );
    },
    [data, mutate]
  );

  const optimisticAdd = useCallback(
    (newTask: Task) => {
      if (!data) return;

      mutate(
        {
          ...data,
          tasks: [newTask, ...data.tasks],
          pagination: data.pagination ? {
            ...data.pagination,
            total: data.pagination.total + 1,
          } : undefined,
        },
        false
      );
    },
    [data, mutate]
  );

  return {
    tasks: data?.tasks,
    pagination: data?.pagination,
    isLoading,
    isValidating,
    error: error as Error | undefined,
    isError: !!error,
    mutate,
    refresh,
    optimisticUpdate,
    optimisticDelete,
    optimisticAdd,
  };
}
