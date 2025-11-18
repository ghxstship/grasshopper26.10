import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type AdvancingCategory =
  | 'access'
  | 'accommodation'
  | 'hospitality'
  | 'marketing'
  | 'permits'
  | 'security'
  | 'staffing'
  | 'technical'
  | 'transportation'
  | 'travel'
  | 'equipment'
  | 'production'
  | 'other';

export type AdvancingStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed';

export type AdvancingPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface AdvancingRequest {
  id: string;
  category: AdvancingCategory;
  title: string;
  description: string;
  status: AdvancingStatus;
  priority: AdvancingPriority;
  eventId?: string;
  eventName?: string;
  requestedBy: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface AdvancingFormData {
  category: AdvancingCategory;
  title: string;
  description: string;
  priority: AdvancingPriority;
  eventId?: string;
  dueDate?: string;
  metadata?: Record<string, unknown>;
}

interface AdvancingState {
  // State
  requests: AdvancingRequest[];
  currentRequest: AdvancingRequest | null;
  formData: Partial<AdvancingFormData>;
  filters: {
    category: string;
    status: string;
    priority: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setRequests: (requests: AdvancingRequest[]) => void;
  setCurrentRequest: (request: AdvancingRequest | null) => void;
  addRequest: (request: AdvancingRequest) => void;
  updateRequest: (id: string, updates: Partial<AdvancingRequest>) => void;
  deleteRequest: (id: string) => void;
  updateFormData: (data: Partial<AdvancingFormData>) => void;
  resetFormData: () => void;
  updateFilters: (filters: Partial<AdvancingState['filters']>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialFilters = {
  category: 'all',
  status: 'all',
  priority: 'all',
  search: '',
};

const initialState = {
  requests: [],
  currentRequest: null,
  formData: {},
  filters: initialFilters,
  isLoading: false,
  error: null,
};

export const useAdvancingStore = create<AdvancingState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setRequests: (requests) => set({ requests }),

        setCurrentRequest: (request) => set({ currentRequest: request }),

        addRequest: (request) =>
          set((state) => ({
            requests: [request, ...state.requests],
          })),

        updateRequest: (id, updates) =>
          set((state) => ({
            requests: state.requests.map((req) =>
              req.id === id ? { ...req, ...updates } : req
            ),
            currentRequest:
              state.currentRequest?.id === id
                ? { ...state.currentRequest, ...updates }
                : state.currentRequest,
          })),

        deleteRequest: (id) =>
          set((state) => ({
            requests: state.requests.filter((req) => req.id !== id),
            currentRequest:
              state.currentRequest?.id === id ? null : state.currentRequest,
          })),

        updateFormData: (data) =>
          set((state) => ({
            formData: { ...state.formData, ...data },
          })),

        resetFormData: () => set({ formData: {} }),

        updateFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),

        resetFilters: () => set({ filters: initialFilters }),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'compvss-advancing-storage',
        partialize: (state) => ({
          filters: state.filters,
          formData: state.formData,
        }),
      }
    ),
    { name: 'CompvssAdvancingStore' }
  )
);
