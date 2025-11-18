import { useQuery } from '@tanstack/react-query';

export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export interface SpendingData {
  total: number;
  yearOverYearChange: number;
  thisMonth: {
    amount: number;
    eventsAttended: number;
  };
  lastMonth: {
    amount: number;
    eventsAttended: number;
  };
  average: {
    amount: number;
    eventsPerMonth: number;
  };
  categories: SpendingCategory[];
  insights: Array<{
    type: 'tip' | 'achievement' | 'trend';
    title: string;
    message: string;
  }>;
}

export interface EventHistory {
  id: string;
  eventName: string;
  date: string;
  amount: number;
  category: string;
  venue: string;
}

export interface Recommendation {
  id: string;
  type: 'event' | 'membership' | 'discount';
  title: string;
  description: string;
  imageUrl?: string;
  relevanceScore: number;
}

/**
 * Hook to fetch spending analytics
 */
export function useSpendingAnalytics(year?: number) {
  return useQuery({
    queryKey: ['analytics', 'spending', year],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.append('year', year.toString());
      
      const response = await fetch(`/api/gvteway/analytics/spending?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch spending analytics');
      }
      
      return response.json() as Promise<SpendingData>;
    },
  });
}

/**
 * Hook to fetch event history
 */
export function useEventHistory(filters?: {
  startDate?: string;
  endDate?: string;
  category?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['analytics', 'history', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      
      const response = await fetch(`/api/gvteway/analytics/history?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch event history');
      }
      
      return response.json() as Promise<EventHistory[]>;
    },
  });
}

/**
 * Hook to fetch personalized recommendations
 */
export function useRecommendations() {
  return useQuery({
    queryKey: ['analytics', 'recommendations'],
    queryFn: async () => {
      const response = await fetch('/api/gvteway/analytics/recommendations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      return response.json() as Promise<Recommendation[]>;
    },
  });
}

/**
 * Hook to fetch user activity stats
 */
export function useActivityStats(period: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: ['analytics', 'activity', period],
    queryFn: async () => {
      const response = await fetch(`/api/gvteway/analytics/activity?period=${period}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch activity stats');
      }
      
      return response.json();
    },
  });
}
