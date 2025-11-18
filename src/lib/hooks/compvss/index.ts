/**
 * COMPVSS Hooks Index
 * Re-exports all COMPVSS-specific hooks
 */

export * from './useAffiliates';
export * from './useCheckIns';
export * from './useCredentials';
export * from './useExpenses';
export * from './useIssues';
export * from './useOperations';
export * from './useQRCodes';
export * from './useReferrals';
export * from './useSubmitAdvancing';
export * from './useTeamMembers';

// Create a hook for advancing requests (alias to shared hook)
import { useQuery } from '@tanstack/react-query';

export function useAdvancingRequests(filters?: { status?: string; priority?: string }) {
  return useQuery({
    queryKey: ['compvss', 'advancing', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      
      const response = await fetch(`/api/compvss/advancing?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch advancing requests');
      return response.json();
    },
  });
}
