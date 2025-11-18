import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Asset {
  id: string;
  name: string;
  category: string;
  type: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  assignedTo?: string;
  project?: string;
  serialNumber?: string;
  purchaseDate?: string;
  value?: number;
  description?: string;
  specifications?: Record<string, string>;
  maintenanceHistory?: Array<{
    id: string;
    date: string;
    type: string;
    description: string;
    cost?: number;
  }>;
  images?: string[];
}

interface AssetState {
  // State
  assets: Asset[];
  currentAsset: Asset | null;
  filters: {
    status: string;
    category: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setAssets: (assets: Asset[]) => void;
  setCurrentAsset: (asset: Asset | null) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  updateFilters: (filters: Partial<AssetState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  assets: [],
  currentAsset: null,
  filters: {
    status: 'all',
    category: 'All Categories',
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useAssetStore = create<AssetState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setAssets: (assets) => set({ assets }),

        setCurrentAsset: (asset) => set({ currentAsset: asset }),

        addAsset: (asset) =>
          set((state) => ({
            assets: [asset, ...state.assets],
          })),

        updateAsset: (id, updates) =>
          set((state) => ({
            assets: state.assets.map((asset) =>
              asset.id === id ? { ...asset, ...updates } : asset
            ),
            currentAsset:
              state.currentAsset?.id === id
                ? { ...state.currentAsset, ...updates }
                : state.currentAsset,
          })),

        deleteAsset: (id) =>
          set((state) => ({
            assets: state.assets.filter((asset) => asset.id !== id),
            currentAsset:
              state.currentAsset?.id === id ? null : state.currentAsset,
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
        name: 'atlvs-asset-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'AssetStore' }
  )
);
