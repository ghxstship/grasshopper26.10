/**
 * Teams Hook
 * Fetches and manages COMPVSS teams with error handling and optimistic updates
 * 
 * @param filters - Optional filters for organization and status
 * @returns Teams data with loading/error states and mutation functions
 * 
 * @example
 * ```tsx
 * const { teams, isLoading, error, optimisticUpdate } = useTeams({
 *   organizationId: 'org-123'
 * });
 * ```
 */

import useSWR from 'swr';
import { useCallback } from 'react';

export interface Team {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  leaderId?: string;
  memberCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
});

/**
 * Hook for fetching and managing COMPVSS teams.
 * 
 * @param params - Optional filters for organization and status
 * @returns Teams data with loading/error states and mutation functions
 */
export function useTeams(params?: { [key: string]: string }) {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    `/api/compvss/teams?${params ? Object.keys(params).map(key => `${key}=${params[key]}`).join('&') : ''}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('Error fetching teams:', err);
      },
    }
  );

  /**
   * Refreshes the teams data.
   */
  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  /**
   * Optimistically updates a team.
   * 
   * @param updatedTeam - The updated team
   */
  const optimisticUpdate = useCallback(
    (updatedTeam: Team) => {
      if (!data) return;

      mutate(
        {
          ...data,
          teams: data.teams.map((team: Team) =>
            team.id === updatedTeam.id ? updatedTeam : team
          ),
        },
        false
      );
    },
    [data, mutate]
  );

  /**
   * Optimistically deletes a team.
   * 
   * @param teamId - The ID of the team to delete
   */
  const optimisticDelete = useCallback(
    (teamId: string) => {
      if (!data) return;

      mutate(
        {
          ...data,
          teams: data.teams.filter((team: Team) => team.id !== teamId),
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

  /**
   * Optimistically adds a new team.
   * 
   * @param newTeam - The new team to add
   */
  const optimisticAdd = useCallback(
    (newTeam: Team) => {
      if (!data) return;

      mutate(
        {
          ...data,
          teams: [newTeam, ...data.teams],
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
    teams: data?.teams,
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
