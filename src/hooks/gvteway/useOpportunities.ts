import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: 'volunteer' | 'freelance' | 'create' | 'mentorship' | 'rfp' | 'career' | 'sponsorship' | 'staffing';
  date: string;
  location: string;
  description: string;
  roles: string[];
  perks: string[];
  logo: string;
  urgent?: boolean;
  compvssIntegration?: {
    listingId: string;
    category: string;
    budget?: number;
    contractType: string;
  };
}

export function useOpportunities(type?: string) {
  return useQuery<Opportunity[]>({
    queryKey: ['opportunities', type],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      
      const response = await fetch(`/api/opportunities?${params}`);
      if (!response.ok) throw new Error('Failed to fetch opportunities');
      return response.json();
    },
  });
}

export function useOpportunity(slug: string) {
  return useQuery<Opportunity>({
    queryKey: ['opportunity', slug],
    queryFn: async () => {
      const response = await fetch(`/api/opportunities/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch opportunity');
      return response.json();
    },
    enabled: !!slug,
  });
}

export function useApplyToOpportunity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ opportunityId, application }: { opportunityId: string; application: any }) => {
      const response = await fetch(`/api/opportunities/${opportunityId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });
      if (!response.ok) throw new Error('Failed to apply');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    },
  });
}
