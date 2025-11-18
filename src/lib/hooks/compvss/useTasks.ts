import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface CompvssTask {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  category?: string;
}

export function useCompvssTasks(filters?: { status?: string; assignee?: string }) {
  return useQuery({
    queryKey: ['compvss', 'tasks', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.assignee) params.append('assignee', filters.assignee);
      
      const response = await fetch(`/api/compvss/tasks?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      return { tasks: data.tasks || [] };
    },
  });
}

export function useCreateCompvssTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: Partial<CompvssTask>) => {
      const response = await fetch('/api/compvss/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error('Failed to create task');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compvss', 'tasks'] });
    },
  });
}
