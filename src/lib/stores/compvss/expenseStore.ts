import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'reimbursed';
  submittedBy: string;
  approvedBy: string | null;
  submittedAt: string;
  approvedAt: string | null;
  receiptUrl: string | null;
  metadata?: Record<string, unknown>;
}

interface ExpenseState {
  // State
  expenses: Expense[];
  currentExpense: Expense | null;
  filters: {
    status: string;
    category: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setExpenses: (expenses: Expense[]) => void;
  setCurrentExpense: (expense: Expense | null) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  updateFilters: (filters: Partial<ExpenseState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  expenses: [],
  currentExpense: null,
  filters: {
    status: 'all',
    category: 'all',
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useExpenseStore = create<ExpenseState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setExpenses: (expenses) => set({ expenses }),

        setCurrentExpense: (expense) => set({ currentExpense: expense }),

        addExpense: (expense) =>
          set((state) => ({
            expenses: [expense, ...state.expenses],
          })),

        updateExpense: (id, updates) =>
          set((state) => ({
            expenses: state.expenses.map((exp) =>
              exp.id === id ? { ...exp, ...updates } : exp
            ),
            currentExpense:
              state.currentExpense?.id === id
                ? { ...state.currentExpense, ...updates }
                : state.currentExpense,
          })),

        deleteExpense: (id) =>
          set((state) => ({
            expenses: state.expenses.filter((exp) => exp.id !== id),
            currentExpense:
              state.currentExpense?.id === id ? null : state.currentExpense,
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
        name: 'compvss-expense-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'ExpenseStore' }
  )
);
