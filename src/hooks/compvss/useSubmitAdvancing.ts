import { useState, useCallback } from 'react';
import { useAdvancingRequests } from './useAdvancingRequests';

export function useSubmitAdvancing() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useAdvancingRequests();

  const submitAdvancing = useCallback(
    async (data: any) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/compvss/advancing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Submission failed');
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

  return { submitAdvancing, isLoading, error };
}
