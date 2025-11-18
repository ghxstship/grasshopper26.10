import { useQuery } from '@tanstack/react-query';

export function useAdvancing(filters?: { status?: string; category?: string }) {
  return useQuery({
    queryKey: ['compvss', 'advancing', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.category) params.append('category', filters.category);
      
      const response = await fetch(`/api/compvss/advancing?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch advancing data');
      return response.json();
    },
  });
}
