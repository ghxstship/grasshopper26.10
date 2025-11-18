import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  projectId: string;
  assigneeId: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  dependencies: string[];
  tags: string[];
  metadata?: Record<string, unknown>;
}

interface TaskState {
  // State
  tasks: Task[];
  currentTask: Task | null;
  filters: {
    status: string;
    priority: string;
    assignee: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setTasks: (tasks: Task[]) => void;
  setCurrentTask: (task: Task | null) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateFilters: (filters: Partial<TaskState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  tasks: [],
  currentTask: null,
  filters: {
    status: 'all',
    priority: 'all',
    assignee: 'all',
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useTaskStore = create<TaskState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setTasks: (tasks) => set({ tasks }),

        setCurrentTask: (task) => set({ currentTask: task }),

        addTask: (task) =>
          set((state) => ({
            tasks: [task, ...state.tasks],
          })),

        updateTask: (id, updates) =>
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...updates } : task
            ),
            currentTask:
              state.currentTask?.id === id
                ? { ...state.currentTask, ...updates }
                : state.currentTask,
          })),

        deleteTask: (id) =>
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
            currentTask:
              state.currentTask?.id === id ? null : state.currentTask,
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
        name: 'atlvs-task-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'TaskStore' }
  )
);
