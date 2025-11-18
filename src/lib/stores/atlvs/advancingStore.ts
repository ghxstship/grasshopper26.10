import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AdvancingRequest {
  id: string;
  title: string;
  type: string;
  project: string;
  requestedBy: string;
  requestedAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'submitted' | 'under-review' | 'pending' | 'approved' | 'rejected';
  dueDate: string;
  description: string;
  details: Record<string, string>;
  attachments: Array<{ id: string; name: string; size: string; url?: string }>;
  timeline: Array<{
    id: string;
    status: string;
    date: string;
    user: string;
    note: string;
  }>;
  comments: Array<{
    id: string;
    user: string;
    text: string;
    time: string;
  }>;
}

export interface AdvancingComment {
  id: string;
  requestId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface AdvancingState {
  // State
  requests: AdvancingRequest[];
  currentRequest: AdvancingRequest | null;
  filters: {
    status: string;
    priority: string;
    category: string;
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
  addComment: (requestId: string, comment: AdvancingComment) => void;
  updateFilters: (filters: Partial<AdvancingState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  requests: [],
  currentRequest: null,
  filters: {
    status: 'all',
    priority: 'all',
    category: 'All Categories',
    search: '',
  },
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

        addComment: (requestId, comment) =>
          set((state) => ({
            requests: state.requests.map((req) =>
              req.id === requestId
                ? {
                    ...req,
                    comments: [
                      {
                        id: comment.id,
                        user: comment.userName,
                        text: comment.content,
                        time: comment.createdAt,
                      },
                      ...req.comments,
                    ],
                  }
                : req
            ),
            currentRequest:
              state.currentRequest?.id === requestId
                ? {
                    ...state.currentRequest,
                    comments: [
                      {
                        id: comment.id,
                        user: comment.userName,
                        text: comment.content,
                        time: comment.createdAt,
                      },
                      ...state.currentRequest.comments,
                    ],
                  }
                : state.currentRequest,
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
        name: 'atlvs-advancing-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'AdvancingStore' }
  )
);
