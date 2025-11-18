import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface CheckIn {
  id: string;
  userId: string;
  userName: string;
  location: string;
  eventId: string | null;
  checkInTime: string;
  checkOutTime: string | null;
  status: 'checked-in' | 'checked-out';
  metadata?: Record<string, unknown>;
}

interface CheckInState {
  // State
  checkIns: CheckIn[];
  currentCheckIn: CheckIn | null;
  filters: {
    location: string;
    status: string;
    date: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setCheckIns: (checkIns: CheckIn[]) => void;
  setCurrentCheckIn: (checkIn: CheckIn | null) => void;
  addCheckIn: (checkIn: CheckIn) => void;
  updateCheckIn: (id: string, updates: Partial<CheckIn>) => void;
  deleteCheckIn: (id: string) => void;
  updateFilters: (filters: Partial<CheckInState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  checkIns: [],
  currentCheckIn: null,
  filters: {
    location: 'all',
    status: 'all',
    date: new Date().toISOString().split('T')[0],
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useCheckInStore = create<CheckInState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setCheckIns: (checkIns) => set({ checkIns }),

        setCurrentCheckIn: (checkIn) => set({ currentCheckIn: checkIn }),

        addCheckIn: (checkIn) =>
          set((state) => ({
            checkIns: [checkIn, ...state.checkIns],
          })),

        updateCheckIn: (id, updates) =>
          set((state) => ({
            checkIns: state.checkIns.map((ci) =>
              ci.id === id ? { ...ci, ...updates } : ci
            ),
            currentCheckIn:
              state.currentCheckIn?.id === id
                ? { ...state.currentCheckIn, ...updates }
                : state.currentCheckIn,
          })),

        deleteCheckIn: (id) =>
          set((state) => ({
            checkIns: state.checkIns.filter((ci) => ci.id !== id),
            currentCheckIn:
              state.currentCheckIn?.id === id ? null : state.currentCheckIn,
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
        name: 'compvss-checkin-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'CheckInStore' }
  )
);
