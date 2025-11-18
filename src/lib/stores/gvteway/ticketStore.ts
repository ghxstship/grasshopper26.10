import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  type: 'general' | 'vip' | 'early-bird' | 'group';
  price: number;
  currency: string;
  quantity: number;
  available: number;
  status: 'available' | 'sold-out' | 'coming-soon';
  benefits: string[];
  restrictions?: string[];
}

export interface PurchasedTicket {
  id: string;
  ticketId: string;
  eventId: string;
  eventTitle: string;
  type: string;
  price: number;
  currency: string;
  purchaseDate: string;
  status: 'valid' | 'used' | 'cancelled' | 'refunded';
  qrCode: string;
  transferable: boolean;
  refundable: boolean;
  validUntil: string;
  seat?: string;
  section?: string;
}

interface TicketState {
  // State
  tickets: Ticket[];
  purchasedTickets: PurchasedTicket[];
  currentTicket: PurchasedTicket | null;
  selectedTickets: Map<string, number>; // ticketId -> quantity
  isLoading: boolean;
  error: string | null;

  // Actions
  setTickets: (tickets: Ticket[]) => void;
  setPurchasedTickets: (tickets: PurchasedTicket[]) => void;
  setCurrentTicket: (ticket: PurchasedTicket | null) => void;
  addToSelection: (ticketId: string, quantity: number) => void;
  removeFromSelection: (ticketId: string) => void;
  updateSelectionQuantity: (ticketId: string, quantity: number) => void;
  clearSelection: () => void;
  addPurchasedTicket: (ticket: PurchasedTicket) => void;
  updateTicketStatus: (ticketId: string, status: PurchasedTicket['status']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  tickets: [],
  purchasedTickets: [],
  currentTicket: null,
  selectedTickets: new Map(),
  isLoading: false,
  error: null,
};

export const useTicketStore = create<TicketState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setTickets: (tickets) => set({ tickets }),

        setPurchasedTickets: (tickets) => set({ purchasedTickets: tickets }),

        setCurrentTicket: (ticket) => set({ currentTicket: ticket }),

        addToSelection: (ticketId, quantity) =>
          set((state) => {
            const newSelection = new Map(state.selectedTickets);
            newSelection.set(ticketId, quantity);
            return { selectedTickets: newSelection };
          }),

        removeFromSelection: (ticketId) =>
          set((state) => {
            const newSelection = new Map(state.selectedTickets);
            newSelection.delete(ticketId);
            return { selectedTickets: newSelection };
          }),

        updateSelectionQuantity: (ticketId, quantity) =>
          set((state) => {
            const newSelection = new Map(state.selectedTickets);
            if (quantity <= 0) {
              newSelection.delete(ticketId);
            } else {
              newSelection.set(ticketId, quantity);
            }
            return { selectedTickets: newSelection };
          }),

        clearSelection: () => set({ selectedTickets: new Map() }),

        addPurchasedTicket: (ticket) =>
          set((state) => ({
            purchasedTickets: [ticket, ...state.purchasedTickets],
          })),

        updateTicketStatus: (ticketId, status) =>
          set((state) => ({
            purchasedTickets: state.purchasedTickets.map((ticket) =>
              ticket.id === ticketId ? { ...ticket, status } : ticket
            ),
            currentTicket:
              state.currentTicket?.id === ticketId
                ? { ...state.currentTicket, status }
                : state.currentTicket,
          })),

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),
      }),
      {
        name: 'gvteway-ticket-storage',
        partialize: (state) => ({
          purchasedTickets: state.purchasedTickets,
        }),
      }
    ),
    { name: 'TicketStore' }
  )
);
