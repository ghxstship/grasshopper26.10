import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Budget {
  id: string;
  name: string;
  project: string;
  totalAmount: number;
  spent: number;
  remaining: number;
  currency: string;
  status: 'draft' | 'active' | 'completed' | 'overbudget';
  startDate: string;
  endDate: string;
  categories: Array<{
    id: string;
    name: string;
    allocated: number;
    spent: number;
  }>;
  expenses: Array<{
    id: string;
    category: string;
    amount: number;
    description: string;
    date: string;
    vendor?: string;
  }>;
}

interface BudgetState {
  budgets: Budget[];
  currentBudget: Budget | null;
  filters: {
    status: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  setBudgets: (budgets: Budget[]) => void;
  setCurrentBudget: (budget: Budget | null) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addExpense: (budgetId: string, expense: Budget['expenses'][0]) => void;
  updateFilters: (filters: Partial<BudgetState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  budgets: [],
  currentBudget: null,
  filters: {
    status: 'all',
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useBudgetStore = create<BudgetState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setBudgets: (budgets) => set({ budgets }),

        setCurrentBudget: (budget) => set({ currentBudget: budget }),

        addBudget: (budget) =>
          set((state) => ({
            budgets: [budget, ...state.budgets],
          })),

        updateBudget: (id, updates) =>
          set((state) => ({
            budgets: state.budgets.map((budget) =>
              budget.id === id ? { ...budget, ...updates } : budget
            ),
            currentBudget:
              state.currentBudget?.id === id
                ? { ...state.currentBudget, ...updates }
                : state.currentBudget,
          })),

        deleteBudget: (id) =>
          set((state) => ({
            budgets: state.budgets.filter((budget) => budget.id !== id),
            currentBudget:
              state.currentBudget?.id === id ? null : state.currentBudget,
          })),

        addExpense: (budgetId, expense) =>
          set((state) => ({
            budgets: state.budgets.map((budget) =>
              budget.id === budgetId
                ? {
                    ...budget,
                    expenses: [expense, ...budget.expenses],
                    spent: budget.spent + expense.amount,
                    remaining: budget.remaining - expense.amount,
                  }
                : budget
            ),
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
        name: 'atlvs-budget-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'BudgetStore' }
  )
);
