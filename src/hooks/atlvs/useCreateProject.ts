import { useState, useCallback } from 'react';
import { useProjects } from './useProjects';

interface CreateProjectData {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget?: number;
  organizationId: string;
  status?: string;
  type?: string;
  [key: string]: string | number | boolean | undefined;
}

export function useCreateProject() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { mutate } = useProjects();

  const createProject = useCallback(
    async (data: CreateProjectData) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/atlvs/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create project');
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

  return { createProject, isLoading, error };
}
