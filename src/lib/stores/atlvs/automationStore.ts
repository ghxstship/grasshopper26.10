import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'draft' | 'error';
  trigger: {
    type: string;
    config: Record<string, unknown>;
  };
  actions: Array<{
    id: string;
    type: string;
    config: Record<string, unknown>;
  }>;
  schedule?: string;
  lastRun?: string;
  nextRun?: string;
  runCount?: number;
  successRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'success' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  logs: Array<{
    id: string;
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
  }>;
}

interface AutomationState {
  // State
  workflows: AutomationWorkflow[];
  currentWorkflow: AutomationWorkflow | null;
  executions: AutomationExecution[];
  filters: {
    category: string;
    status: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setWorkflows: (workflows: AutomationWorkflow[]) => void;
  setCurrentWorkflow: (workflow: AutomationWorkflow | null) => void;
  addWorkflow: (workflow: AutomationWorkflow) => void;
  updateWorkflow: (id: string, updates: Partial<AutomationWorkflow>) => void;
  deleteWorkflow: (id: string) => void;
  setExecutions: (executions: AutomationExecution[]) => void;
  addExecution: (execution: AutomationExecution) => void;
  updateFilters: (filters: Partial<AutomationState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  workflows: [],
  currentWorkflow: null,
  executions: [],
  filters: {
    category: 'All',
    status: 'all',
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useAutomationStore = create<AutomationState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setWorkflows: (workflows) => set({ workflows }),

        setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),

        addWorkflow: (workflow) =>
          set((state) => ({
            workflows: [workflow, ...state.workflows],
          })),

        updateWorkflow: (id, updates) =>
          set((state) => ({
            workflows: state.workflows.map((wf) =>
              wf.id === id ? { ...wf, ...updates } : wf
            ),
            currentWorkflow:
              state.currentWorkflow?.id === id
                ? { ...state.currentWorkflow, ...updates }
                : state.currentWorkflow,
          })),

        deleteWorkflow: (id) =>
          set((state) => ({
            workflows: state.workflows.filter((wf) => wf.id !== id),
            currentWorkflow:
              state.currentWorkflow?.id === id ? null : state.currentWorkflow,
          })),

        setExecutions: (executions) => set({ executions }),

        addExecution: (execution) =>
          set((state) => ({
            executions: [execution, ...state.executions],
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
        name: 'atlvs-automation-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'AutomationStore' }
  )
);
