import { renderHook } from '@testing-library/react';
import { useTasks } from '../atlvs/useTasks';

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: {
      tasks: [
        {
          id: '1',
          title: 'Test Task',
          status: 'TODO',
          priority: 'HIGH',
          assigneeId: 'user-1',
        },
        {
          id: '2',
          title: 'Another Task',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          assigneeId: 'user-2',
        },
      ],
      pagination: { page: 1, total: 2, pageSize: 10 },
    },
    error: null,
    isLoading: false,
    mutate: jest.fn(),
  })),
}));

describe('useTasks', () => {
  it('should return tasks list', () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks?.[0].title).toBe('Test Task');
  });

  it('should return pagination data', () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.pagination).toBeDefined();
    expect(result.current.pagination?.total).toBe(2);
  });

  it('should not be loading', () => {
    const { result } = renderHook(() => useTasks());
    
    expect(result.current.isLoading).toBe(false);
  });

  it('should have mutate function', () => {
    const { result } = renderHook(() => useTasks());
    
    expect(typeof result.current.mutate).toBe('function');
  });

  it('should handle filters', () => {
    const { result } = renderHook(() => useTasks({ status: 'TODO' }));
    
    expect(result.current.tasks).toBeDefined();
  });
});
