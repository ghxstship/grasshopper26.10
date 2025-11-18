import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface LoyaltyPoints {
  total: number;
  available: number;
  pending: number;
  lifetime: number;
}

export interface PointsTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: string;
  imageUrl: string;
  available: boolean;
  expiresAt: string | null;
}

interface LoyaltyState {
  // State
  points: LoyaltyPoints;
  transactions: PointsTransaction[];
  rewards: Reward[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setPoints: (points: LoyaltyPoints) => void;
  setTransactions: (transactions: PointsTransaction[]) => void;
  addTransaction: (transaction: PointsTransaction) => void;
  setRewards: (rewards: Reward[]) => void;
  updatePoints: (amount: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  points: {
    total: 0,
    available: 0,
    pending: 0,
    lifetime: 0,
  },
  transactions: [],
  rewards: [],
  isLoading: false,
  error: null,
};

export const useLoyaltyStore = create<LoyaltyState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setPoints: (points) => set({ points }),

        setTransactions: (transactions) => set({ transactions }),

        addTransaction: (transaction) =>
          set((state) => ({
            transactions: [transaction, ...state.transactions],
          })),

        setRewards: (rewards) => set({ rewards }),

        updatePoints: (amount) =>
          set((state) => ({
            points: {
              ...state.points,
              available: state.points.available + amount,
              total: state.points.total + amount,
            },
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'gvteway-loyalty-storage',
        partialize: (state) => ({
          points: state.points,
        }),
      }
    ),
    { name: 'LoyaltyStore' }
  )
);
