import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface MembershipTier {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  benefits: string[];
  priority: number;
  active: boolean;
}

export interface UserMembership {
  id: string;
  userId: string;
  tierId: string;
  tierName: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  metadata?: Record<string, unknown>;
}

interface MembershipState {
  // State
  tiers: MembershipTier[];
  currentMembership: UserMembership | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTiers: (tiers: MembershipTier[]) => void;
  setCurrentMembership: (membership: UserMembership | null) => void;
  updateMembership: (updates: Partial<UserMembership>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  tiers: [],
  currentMembership: null,
  isLoading: false,
  error: null,
};

export const useMembershipStore = create<MembershipState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setTiers: (tiers) => set({ tiers }),

        setCurrentMembership: (membership) =>
          set({ currentMembership: membership }),

        updateMembership: (updates) =>
          set((state) => ({
            currentMembership: state.currentMembership
              ? { ...state.currentMembership, ...updates }
              : null,
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'gvteway-membership-storage',
      }
    ),
    { name: 'MembershipStore' }
  )
);
