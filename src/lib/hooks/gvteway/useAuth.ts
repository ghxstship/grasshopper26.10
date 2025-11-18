import { useQuery } from '@tanstack/react-query';

export function useAuth() {
  return useQuery({
    queryKey: ['gvteway', 'auth', 'user'],
    queryFn: async () => {
      const response = await fetch('/api/gvteway/auth/me');
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });
}
