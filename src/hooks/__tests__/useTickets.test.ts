import { renderHook } from '@testing-library/react';
import { useTickets } from '../gvteway/useTickets';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: {
      tickets: [
        {
          id: '1',
          eventId: 'event-1',
          userId: 'user-1',
          qrCode: 'QR123',
          status: 'ACTIVE',
        },
      ],
      pagination: { page: 1, total: 1, pageSize: 10 },
    },
    error: null,
    isLoading: false,
    mutate: jest.fn(),
  })),
}));

describe('useTickets', () => {
  it('should return tickets list', () => {
    const { result } = renderHook(() => useTickets());
    
    expect(result.current.tickets).toHaveLength(1);
    expect(result.current.tickets?.[0].qrCode).toBe('QR123');
  });

  it('should return pagination data', () => {
    const { result } = renderHook(() => useTickets());
    
    expect(result.current.pagination).toBeDefined();
    expect(result.current.pagination?.total).toBe(1);
  });

  it('should not be loading', () => {
    const { result } = renderHook(() => useTickets());
    
    expect(result.current.isLoading).toBe(false);
  });

  it('should have mutate function', () => {
    const { result } = renderHook(() => useTickets());
    
    expect(typeof result.current.mutate).toBe('function');
  });
});
