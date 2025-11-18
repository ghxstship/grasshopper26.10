import useSWR from 'swr';
import type { Project } from './useProjects';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useProject(id: string | null) {
  const { data, error, mutate, isLoading } = useSWR<Project>(
    id ? `/api/atlvs/projects/${id}` : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  return {
    project: data,
    isLoading,
    isError: error,
    mutate,
  };
}
