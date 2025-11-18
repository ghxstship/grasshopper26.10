import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface QRCode {
  id: string;
  code: string;
  type: 'check-in' | 'credential' | 'access' | 'asset';
  entityId: string;
  entityType: string;
  status: 'active' | 'inactive' | 'expired';
  scannedCount: number;
  createdAt: string;
  expiresAt: string | null;
  metadata?: Record<string, unknown>;
}

interface QRState {
  // State
  qrCodes: QRCode[];
  currentQRCode: QRCode | null;
  recentScans: Array<{
    id: string;
    qrCodeId: string;
    scannedBy: string;
    scannedAt: string;
    location: string;
  }>;
  filters: {
    type: string;
    status: string;
    search: string;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setQRCodes: (qrCodes: QRCode[]) => void;
  setCurrentQRCode: (qrCode: QRCode | null) => void;
  addQRCode: (qrCode: QRCode) => void;
  updateQRCode: (id: string, updates: Partial<QRCode>) => void;
  deleteQRCode: (id: string) => void;
  addScan: (scan: QRState['recentScans'][0]) => void;
  updateFilters: (filters: Partial<QRState['filters']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  qrCodes: [],
  currentQRCode: null,
  recentScans: [],
  filters: {
    type: 'all',
    status: 'all',
    search: '',
  },
  isLoading: false,
  error: null,
};

export const useQRStore = create<QRState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setQRCodes: (qrCodes) => set({ qrCodes }),

        setCurrentQRCode: (qrCode) => set({ currentQRCode: qrCode }),

        addQRCode: (qrCode) =>
          set((state) => ({
            qrCodes: [qrCode, ...state.qrCodes],
          })),

        updateQRCode: (id, updates) =>
          set((state) => ({
            qrCodes: state.qrCodes.map((qr) =>
              qr.id === id ? { ...qr, ...updates } : qr
            ),
            currentQRCode:
              state.currentQRCode?.id === id
                ? { ...state.currentQRCode, ...updates }
                : state.currentQRCode,
          })),

        deleteQRCode: (id) =>
          set((state) => ({
            qrCodes: state.qrCodes.filter((qr) => qr.id !== id),
            currentQRCode:
              state.currentQRCode?.id === id ? null : state.currentQRCode,
          })),

        addScan: (scan) =>
          set((state) => ({
            recentScans: [scan, ...state.recentScans.slice(0, 49)],
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
        name: 'compvss-qr-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'QRStore' }
  )
);
