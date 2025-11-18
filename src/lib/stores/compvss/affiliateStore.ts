import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  code: string;
  status: 'active' | 'inactive' | 'suspended';
  commissionRate: number;
  totalReferrals: number;
  totalEarnings: number;
  joinedAt: string;
  metadata?: Record<string, unknown>;
}

interface AffiliateState {
  // State
  affiliates: Affiliate[];
  currentAffiliate: Affiliate | null;
  filters: {
    status: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setAffiliates: (affiliates: Affiliate[]) => void;
  setCurrentAffiliate: (affiliate: Affiliate | null) => void;
  addAffiliate: (affiliate: Affiliate) => void;
  updateAffiliate: (id: string, updates: Partial<Affiliate>) => void;
  deleteAffiliate: (id: string) => void;
  updateFilters: (filters: Partial<AffiliateState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  affiliates: [],
  currentAffiliate: null,
  filters: {
    status: 'all',
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useAffiliateStore = create<AffiliateState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setAffiliates: (affiliates) => set({ affiliates }),

        setCurrentAffiliate: (affiliate) => set({ currentAffiliate: affiliate }),

        addAffiliate: (affiliate) =>
          set((state) => ({
            affiliates: [affiliate, ...state.affiliates],
          })),

        updateAffiliate: (id, updates) =>
          set((state) => ({
            affiliates: state.affiliates.map((aff) =>
              aff.id === id ? { ...aff, ...updates } : aff
            ),
            currentAffiliate:
              state.currentAffiliate?.id === id
                ? { ...state.currentAffiliate, ...updates }
                : state.currentAffiliate,
          })),

        deleteAffiliate: (id) =>
          set((state) => ({
            affiliates: state.affiliates.filter((aff) => aff.id !== id),
            currentAffiliate:
              state.currentAffiliate?.id === id ? null : state.currentAffiliate,
          })),

        updateFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'compvss-affiliate-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'AffiliateStore' }
  )
);
