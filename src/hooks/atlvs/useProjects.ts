/**
 * Projects Hook
 * Fetches and manages ATLVS projects with error handling and optimistic updates
 * 
 * @param filters - Optional filters for project status
 * @returns Projects data with loading/error states and mutation functions
 * 
 * @example
 * ```tsx
 * const { projects, isLoading, error, optimisticUpdate } = useProjects({
 *   status: 'active'
 * });
 * ```
 */

import useSWR from 'swr';
import { useCallback } from 'react';

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: string;
  priority: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  spent: number;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
});

export function useProjects(filters?: { status?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);

  const { data, error, mutate, isLoading, isValidating } = useSWR(
    `/api/atlvs/projects?${params}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('Error fetching projects:', err);
      },
    }
  );

  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  const optimisticUpdate = useCallback(
    (updatedProject: Project) => {
      if (!data) return;

      mutate(
        {
          ...data,
          projects: data.projects.map((project: Project) =>
            project.id === updatedProject.id ? updatedProject : project
          ),
        },
        false
      );
    },
    [data, mutate]
  );

  const optimisticDelete = useCallback(
    (projectId: string) => {
      if (!data) return;

      mutate(
        {
          ...data,
          projects: data.projects.filter((project: Project) => project.id !== projectId),
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
    (newProject: Project) => {
      if (!data) return;

      mutate(
        {
          ...data,
          projects: [newProject, ...data.projects],
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
    projects: data?.projects,
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
