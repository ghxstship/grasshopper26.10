import { renderHook } from '@testing-library/react';
import { useAuth } from '../auth/useAuth';

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: null,
    error: null,
    isLoading: false,
    mutate: jest.fn(),
  })),
}));

describe('useAuth', () => {
  it('should return initial auth state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should have login function', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(typeof result.current.login).toBe('function');
  });

  it('should have logout function', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(typeof result.current.logout).toBe('function');
  });

  it('should have register function', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(typeof result.current.register).toBe('function');
  });
});
