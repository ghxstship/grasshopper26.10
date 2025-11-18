import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Adventure {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  capacity: number;
  availableSpots: number;
  location: string;
  imageUrl: string;
  featured: boolean;
  rating: number;
  reviews: number;
  startDate: string;
  endDate: string;
  metadata?: Record<string, unknown>;
}

export interface AdventureBooking {
  id: string;
  adventureId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guests: number;
  totalPrice: number;
  bookingDate: string;
  metadata?: Record<string, unknown>;
}

interface AdventureState {
  // State
  adventures: Adventure[];
  currentAdventure: Adventure | null;
  bookings: AdventureBooking[];
  filters: {
    category: string;
    priceRange: [number, number];
    dateRange: [string, string] | null;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setAdventures: (adventures: Adventure[]) => void;
  setCurrentAdventure: (adventure: Adventure | null) => void;
  setBookings: (bookings: AdventureBooking[]) => void;
  addBooking: (booking: AdventureBooking) => void;
  updateBooking: (id: string, updates: Partial<AdventureBooking>) => void;
  updateFilters: (filters: Partial<AdventureState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  adventures: [],
  currentAdventure: null,
  bookings: [],
  filters: {
    category: 'all',
    priceRange: [0, 10000] as [number, number],
    dateRange: null,
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useAdventureStore = create<AdventureState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setAdventures: (adventures) => set({ adventures }),

        setCurrentAdventure: (adventure) => set({ currentAdventure: adventure }),

        setBookings: (bookings) => set({ bookings }),

        addBooking: (booking) =>
          set((state) => ({
            bookings: [booking, ...state.bookings],
          })),

        updateBooking: (id, updates) =>
          set((state) => ({
            bookings: state.bookings.map((booking) =>
              booking.id === id ? { ...booking, ...updates } : booking
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
        name: 'gvteway-adventure-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'AdventureStore' }
  )
);
