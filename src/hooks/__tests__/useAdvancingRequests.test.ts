import { renderHook } from '@testing-library/react';
import { useAdvancingRequests } from '../compvss/useAdvancingRequests';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: {
      requests: [
        {
          id: '1',
          category: 'ACCESS',
          title: 'Test Request',
          status: 'PENDING',
          priority: 'HIGH',
        },
      ],
      pagination: { page: 1, total: 1, pageSize: 10 },
    },
    error: null,
    isLoading: false,
    mutate: jest.fn(),
  })),
}));

describe('useAdvancingRequests', () => {
  it('should return advancing requests list', () => {
    const { result } = renderHook(() => useAdvancingRequests());
    
    expect(result.current.requests).toHaveLength(1);
    expect(result.current.requests?.[0].title).toBe('Test Request');
  });

  it('should return pagination data', () => {
    const { result } = renderHook(() => useAdvancingRequests());
    
    expect(result.current.pagination).toBeDefined();
    expect(result.current.pagination?.total).toBe(1);
  });

  it('should not be loading', () => {
    const { result } = renderHook(() => useAdvancingRequests());
    
    expect(result.current.isLoading).toBe(false);
  });

  it('should have mutate function', () => {
    const { result } = renderHook(() => useAdvancingRequests());
    
    expect(typeof result.current.mutate).toBe('function');
  });
});
