import { useQuery } from '@tanstack/react-query';

export function useAuth() {
  return useQuery({
    queryKey: ['compvss', 'auth', 'user'],
    queryFn: async () => {
      const response = await fetch('/api/compvss/auth/me');
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });
}
