import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'refund' | 'reward';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  metadata?: Record<string, unknown>;
}

interface WalletState {
  // State
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setBalance: (balance: number) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateBalance: (amount: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
};

export const useWalletStore = create<WalletState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setBalance: (balance) => set({ balance }),

        setTransactions: (transactions) => set({ transactions }),

        addTransaction: (transaction) =>
          set((state) => ({
            transactions: [transaction, ...state.transactions],
          })),

        updateBalance: (amount) =>
          set((state) => ({
            balance: state.balance + amount,
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'gvteway-wallet-storage',
        partialize: (state) => ({
          balance: state.balance,
        }),
      }
    ),
    { name: 'WalletStore' }
  )
);
