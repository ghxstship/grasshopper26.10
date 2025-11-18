import useSWR from 'swr';
import { useMutation } from '@tanstack/react-query';

export interface CompvssTask {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
  location?: string;
  eventId?: string;
  notes?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCompvssTasks(filters?: { status?: string; assignedTo?: string; eventId?: string }) {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const { data, error, mutate, isLoading } = useSWR(
    `/api/compvss/tasks?${params}`,
    fetcher
  );

  return {
    tasks: data?.tasks,
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useCompvssTask(taskId?: string) {
  const { data, error, mutate, isLoading } = useSWR(
    taskId ? `/api/compvss/tasks/${taskId}` : null,
    fetcher
  );

  return {
    task: data,
    isLoading,
    error,
    refetch: mutate,
  };
}

export function useCreateCompvssTask() {
  return useMutation({
    mutationFn: async (data: Omit<CompvssTask, 'id' | 'status' | 'completedAt'>) => {
      const response = await fetch('/api/compvss/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create task');
      return response.json();
    },
  });
}

export function useCompleteCompvssTask() {
  return useMutation({
    mutationFn: async ({ taskId, notes }: { taskId: string; notes?: string }) => {
      const response = await fetch(`/api/compvss/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (!response.ok) throw new Error('Failed to complete task');
      return response.json();
    },
  });
}
