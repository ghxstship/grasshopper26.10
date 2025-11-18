import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  reportedBy: string;
  assignedTo: string | null;
  location: string;
  reportedAt: string;
  resolvedAt: string | null;
  metadata?: Record<string, unknown>;
}

interface IssueState {
  // State
  issues: Issue[];
  currentIssue: Issue | null;
  filters: {
    status: string;
    severity: string;
    category: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setIssues: (issues: Issue[]) => void;
  setCurrentIssue: (issue: Issue | null) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  updateFilters: (filters: Partial<IssueState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  issues: [],
  currentIssue: null,
  filters: {
    status: 'all',
    severity: 'all',
    category: 'all',
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useIssueStore = create<IssueState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setIssues: (issues) => set({ issues }),

        setCurrentIssue: (issue) => set({ currentIssue: issue }),

        addIssue: (issue) =>
          set((state) => ({
            issues: [issue, ...state.issues],
          })),

        updateIssue: (id, updates) =>
          set((state) => ({
            issues: state.issues.map((issue) =>
              issue.id === id ? { ...issue, ...updates } : issue
            ),
            currentIssue:
              state.currentIssue?.id === id
                ? { ...state.currentIssue, ...updates }
                : state.currentIssue,
          })),

        deleteIssue: (id) =>
          set((state) => ({
            issues: state.issues.filter((issue) => issue.id !== id),
            currentIssue:
              state.currentIssue?.id === id ? null : state.currentIssue,
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
        name: 'compvss-issue-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'IssueStore' }
  )
);
