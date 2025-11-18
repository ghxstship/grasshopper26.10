import { renderHook } from '@testing-library/react';
import { useProjects } from '../atlvs/useProjects';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: {
      projects: [
        {
          id: '1',
          name: 'Test Project',
          status: 'ACTIVE',
          startDate: '2024-01-01',
        },
      ],
      pagination: { page: 1, total: 1, pageSize: 10 },
    },
    error: null,
    isLoading: false,
    mutate: jest.fn(),
  })),
}));

describe('useProjects', () => {
  it('should return projects list', () => {
    const { result } = renderHook(() => useProjects());
    
    expect(result.current.projects).toHaveLength(1);
    expect(result.current.projects?.[0].name).toBe('Test Project');
  });

  it('should return pagination data', () => {
    const { result } = renderHook(() => useProjects());
    
    expect(result.current.pagination).toBeDefined();
    expect(result.current.pagination?.total).toBe(1);
  });

  it('should not be loading', () => {
    const { result } = renderHook(() => useProjects());
    
    expect(result.current.isLoading).toBe(false);
  });

  it('should have mutate function', () => {
    const { result } = renderHook(() => useProjects());
    
    expect(typeof result.current.mutate).toBe('function');
  });
});
