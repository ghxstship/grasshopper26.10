import { useQuery } from '@tanstack/react-query';

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await fetch('/api/permissions');
      if (!response.ok) throw new Error('Failed to fetch permissions');
      return response.json() as Promise<Permission[]>;
    },
    staleTime: 60000,
  });
}

export function useUserPermissions(userId?: string) {
  return useQuery({
    queryKey: ['permissions', 'user', userId],
    queryFn: async () => {
      const url = userId ? `/api/permissions/user/${userId}` : '/api/permissions/user';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch user permissions');
      return response.json() as Promise<string[]>;
    },
    staleTime: 60000,
  });
}
