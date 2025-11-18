import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AnalyticsData {
  id: string;
  metric: string;
  value: number;
  change: number;
  period: 'day' | 'week' | 'month' | 'year';
  timestamp: string;
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: Array<{
    id: string;
    type: string;
    title: string;
    data: unknown;
  }>;
  layout: Array<{ i: string; x: number; y: number; w: number; h: number }>;
}

interface AnalyticsState {
  // State
  metrics: AnalyticsData[];
  dashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  dateRange: {
    start: string;
    end: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setMetrics: (metrics: AnalyticsData[]) => void;
  setDashboards: (dashboards: Dashboard[]) => void;
  setCurrentDashboard: (dashboard: Dashboard | null) => void;
  updateDateRange: (range: Partial<AnalyticsState['dateRange']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  metrics: [],
  dashboards: [],
  currentDashboard: null,
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
  },
  isLoading: false,
  error: null,
};

export const useAnalyticsStore = create<AnalyticsState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setMetrics: (metrics) => set({ metrics }),

        setDashboards: (dashboards) => set({ dashboards }),

        setCurrentDashboard: (dashboard) => set({ currentDashboard: dashboard }),

        updateDateRange: (range) =>
          set((state) => ({
            dateRange: { ...state.dateRange, ...range },
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'atlvs-analytics-storage',
        partialize: (state) => ({
          dateRange: state.dateRange,
        }),
      }
    ),
    { name: 'AnalyticsStore' }
  )
);
