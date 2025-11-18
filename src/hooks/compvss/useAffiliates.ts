/**
 * Affiliates Hook
 * Fetches and manages COMPVSS affiliates with error handling and optimistic updates
 * 
 * @param filters - Optional filters for organization and status
 * @returns Affiliates data with loading/error states and mutation functions
 * 
 * @example
 * ```tsx
 * const { affiliates, isLoading, error, optimisticUpdate } = useAffiliates({
 *   organizationId: 'org-123',
 *   status: 'active'
 * });
 * ```
 */

import useSWR from 'swr';
import { useCallback } from 'react';

export interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  code: string;
  status: 'active' | 'inactive' | 'suspended';
  clicks: number;
  conversions: number;
  earnings: string;
  createdAt: string;
}

export interface AffiliateActivity {
  event: string;
  link: string;
  amount: string;
  date: string;
}

export interface AffiliateData {
  totalEarnings: number;
  recentEarnings: number;
  recentConversions: number;
  links: AffiliateLink[];
  recentActivity: AffiliateActivity[];
  earnings: {
    month: string;
    amount: string;
    conversions: number;
    status: 'pending' | 'paid' | 'processing';
  }[];
  payouts: {
    id: string;
    amount: string;
    date: string;
    status: 'pending' | 'paid' | 'processing' | 'failed';
    method: string;
  }[];
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
});

/**
 * useAffiliates hook
 * 
 * Fetches and manages COMPVSS affiliates with error handling and optimistic updates
 * 
 * @param params - Optional filters for organization and status
 * @returns Affiliates data with loading/error states and mutation functions
 */
export function useAffiliates(params?: { [key: string]: string }) {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    `/api/compvss/affiliates?${params ? Object.keys(params).map(key => `${key}=${params[key]}`).join('&') : ''}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('Error fetching affiliates:', err);
      },
    }
  );

  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  const optimisticUpdate = useCallback(
    (updatedAffiliate: AffiliateLink) => {
      if (!data) return;

      mutate(
        {
          ...data,
          links: data.links.map((link: AffiliateLink) =>
            link.id === updatedAffiliate.id ? updatedAffiliate : link
          ),
        },
        false
      );
    },
    [data, mutate]
  );

  const optimisticDelete = useCallback(
    (affiliateId: string) => {
      if (!data) return;

      mutate(
        {
          ...data,
          links: data.links.filter((link: AffiliateLink) => link.id !== affiliateId),
        },
        false
      );
    },
    [data, mutate]
  );

  const optimisticAdd = useCallback(
    (newAffiliate: AffiliateLink) => {
      if (!data) return;

      mutate(
        {
          ...data,
          links: [newAffiliate, ...data.links],
        },
        false
      );
    },
    [data, mutate]
  );

  return {
    data,
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

export function useAffiliatePerformance(affiliateId?: string) {
  const { data, error, mutate, isLoading } = useSWR(
    affiliateId ? `/api/compvss/affiliates/${affiliateId}/performance` : null,
    fetcher
  );

  return {
    performance: data,
    isLoading,
    error,
    refetch: mutate,
  };
}
