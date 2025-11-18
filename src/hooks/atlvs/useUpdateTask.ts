import { useState, useCallback } from 'react';
import { useTasks } from './useTasks';

export function useUpdateTask(taskId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useTasks();

  const updateTask = useCallback(
    async (updates: any) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/atlvs/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update task');
        }

        const result = await response.json();
        mutate();
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [taskId, mutate]
  );

  return { updateTask, isLoading, error };
}
