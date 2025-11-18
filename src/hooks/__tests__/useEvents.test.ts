import { renderHook } from '@testing-library/react';
import { useEvents } from '../gvteway/useEvents';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: {
      events: [
        { id: '1', name: 'Test Event 1', date: '2024-12-01' },
        { id: '2', name: 'Test Event 2', date: '2024-12-15' },
      ],
      pagination: { page: 1, total: 2, pageSize: 10 },
    },
    error: null,
    isLoading: false,
    mutate: jest.fn(),
  })),
}));

describe('useEvents', () => {
  it('should return events list', () => {
    const { result } = renderHook(() => useEvents());
    
    expect(result.current.events).toHaveLength(2);
    expect(result.current.events?.[0].name).toBe('Test Event 1');
  });

  it('should return pagination data', () => {
    const { result } = renderHook(() => useEvents());
    
    expect(result.current.pagination).toBeDefined();
    expect(result.current.pagination?.page).toBe(1);
    expect(result.current.pagination?.total).toBe(2);
  });

  it('should not be loading', () => {
    const { result } = renderHook(() => useEvents());
    
    expect(result.current.isLoading).toBe(false);
  });

  it('should have mutate function', () => {
    const { result } = renderHook(() => useEvents());
    
    expect(typeof result.current.mutate).toBe('function');
  });
});
