import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  organizationId: string;
  managerId: string;
  teamMembers: Array<{ id: string; name: string; role: string }>;
  progress: number;
  metadata?: Record<string, unknown>;
}

interface ProjectState {
  // State
  projects: Project[];
  currentProject: Project | null;
  filters: {
    status: string;
    priority: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateFilters: (filters: Partial<ProjectState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  projects: [],
  currentProject: null,
  filters: {
    status: 'all',
    priority: 'all',
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useProjectStore = create<ProjectState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setProjects: (projects) => set({ projects }),

        setCurrentProject: (project) => set({ currentProject: project }),

        addProject: (project) =>
          set((state) => ({
            projects: [project, ...state.projects],
          })),

        updateProject: (id, updates) =>
          set((state) => ({
            projects: state.projects.map((proj) =>
              proj.id === id ? { ...proj, ...updates } : proj
            ),
            currentProject:
              state.currentProject?.id === id
                ? { ...state.currentProject, ...updates }
                : state.currentProject,
          })),

        deleteProject: (id) =>
          set((state) => ({
            projects: state.projects.filter((proj) => proj.id !== id),
            currentProject:
              state.currentProject?.id === id ? null : state.currentProject,
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
        name: 'atlvs-project-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'ProjectStore' }
  )
);
