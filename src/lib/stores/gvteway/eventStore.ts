import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  capacity: number;
  ticketsSold: number;
  price: {
    min: number;
    max: number;
    currency: string;
  };
  images: string[];
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  tags: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  category: string;
  location: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  priceRange: {
    min: number | null;
    max: number | null;
  };
  status: string;
  search: string;
}

interface EventState {
  // State
  events: Event[];
  currentEvent: Event | null;
  filters: EventFilters;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };

  // Actions
  setEvents: (events: Event[]) => void;
  setCurrentEvent: (event: Event | null) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  updateFilters: (filters: Partial<EventFilters>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (pagination: Partial<EventState['pagination']>) => void;
  reset: () => void;
}

const initialFilters: EventFilters = {
  category: 'all',
  location: 'all',
  dateRange: {
    start: null,
    end: null,
  },
  priceRange: {
    min: null,
    max: null,
  },
  status: 'published',
  search: '',
};

const initialState = {
  events: [],
  currentEvent: null,
  filters: initialFilters,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

export const useEventStore = create<EventState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setEvents: (events) => set({ events }),

        setCurrentEvent: (event) => set({ currentEvent: event }),

        addEvent: (event) =>
          set((state) => ({
            events: [event, ...state.events],
            pagination: {
              ...state.pagination,
              total: state.pagination.total + 1,
            },
          })),

        updateEvent: (id, updates) =>
          set((state) => ({
            events: state.events.map((event) =>
              event.id === id ? { ...event, ...updates } : event
            ),
            currentEvent:
              state.currentEvent?.id === id
                ? { ...state.currentEvent, ...updates }
                : state.currentEvent,
          })),

        deleteEvent: (id) =>
          set((state) => ({
            events: state.events.filter((event) => event.id !== id),
            currentEvent:
              state.currentEvent?.id === id ? null : state.currentEvent,
            pagination: {
              ...state.pagination,
              total: Math.max(0, state.pagination.total - 1),
            },
          })),

        updateFilters: (filters) =>
          set((state) => ({
            filters: { ...state.filters, ...filters },
          })),

        resetFilters: () => set({ filters: initialFilters }),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        setPagination: (pagination) =>
          set((state) => ({
            pagination: { ...state.pagination, ...pagination },
          })),

        reset: () => set(initialState),
      }),
      {
        name: 'gvteway-event-storage',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
        }),
      }
    ),
    { name: 'EventStore' }
  )
);
