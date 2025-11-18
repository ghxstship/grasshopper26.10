import { useQuery } from '@tanstack/react-query';

export function useTeam() {
  return useQuery({
    queryKey: ['compvss', 'team'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/team');
      if (!response.ok) throw new Error('Failed to fetch team data');
      return response.json();
    },
  });
}
