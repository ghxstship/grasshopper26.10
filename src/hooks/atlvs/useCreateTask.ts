import { useState, useCallback } from 'react';
import { useTasks } from './useTasks';

export function useCreateTask() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useTasks();

  const createTask = useCallback(
    async (data: any) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/atlvs/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create task');
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
    [mutate]
  );

  return { createTask, isLoading, error };
}
