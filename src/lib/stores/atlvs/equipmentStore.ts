import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  organizationId: string;
  metadata?: Record<string, unknown>;
}

interface EquipmentState {
  // State
  equipment: Equipment[];
  currentEquipment: Equipment | null;
  filters: {
    category: string;
    status: string;
    location: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setEquipment: (equipment: Equipment[]) => void;
  setCurrentEquipment: (equipment: Equipment | null) => void;
  addEquipment: (equipment: Equipment) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  updateFilters: (filters: Partial<EquipmentState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  equipment: [],
  currentEquipment: null,
  filters: {
    category: 'all',
    status: 'all',
    location: 'all',
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useEquipmentStore = create<EquipmentState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setEquipment: (equipment) => set({ equipment }),

        setCurrentEquipment: (equipment) => set({ currentEquipment: equipment }),

        addEquipment: (equipment) =>
          set((state) => ({
            equipment: [equipment, ...state.equipment],
          })),

        updateEquipment: (id, updates) =>
          set((state) => ({
            equipment: state.equipment.map((eq) =>
              eq.id === id ? { ...eq, ...updates } : eq
            ),
            currentEquipment:
              state.currentEquipment?.id === id
                ? { ...state.currentEquipment, ...updates }
                : state.currentEquipment,
          })),

        deleteEquipment: (id) =>
          set((state) => ({
            equipment: state.equipment.filter((eq) => eq.id !== id),
            currentEquipment:
              state.currentEquipment?.id === id ? null : state.currentEquipment,
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
        name: 'atlvs-equipment-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'EquipmentStore' }
  )
);
