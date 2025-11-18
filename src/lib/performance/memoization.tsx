/**
 * Memoization Utilities
 * React.memo wrappers and custom memoization hooks
 */

'use client';

import { memo, useMemo, useCallback } from 'react';

/**
 * Deep comparison for React.memo
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Create memoized component with deep comparison
 */
export function createMemoComponent<P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return memo(Component, propsAreEqual || ((prev, next) => deepEqual(prev, next)));
}

/**
 * Memoize expensive calculations
 * Note: Pass inline function directly to useMemo instead of using this wrapper
 * @deprecated Use useMemo directly with inline function
 */
export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}

/**
 * Memoize callback functions
 * Note: Pass inline function directly to useCallback instead of using this wrapper
 * @deprecated Use useCallback directly with inline function
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, deps) as T;
}

/**
 * Memoize array transformations
 */
export function useMemoizedArray<T, R>(
  array: T[],
  transform: (item: T, index: number) => R
): R[] {
  return useMemo(
    () => array.map(transform),
    [array, transform]
  );
}

/**
 * Memoize filtered arrays
 */
export function useMemoizedFilter<T>(
  array: T[],
  predicate: (item: T, index: number) => boolean
): T[] {
  return useMemo(
    () => array.filter(predicate),
    [array, predicate]
  );
}

/**
 * Memoize sorted arrays
 */
export function useMemoizedSort<T>(
  array: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  return useMemo(
    () => [...array].sort(compareFn),
    [array, compareFn]
  );
}

/**
 * Memoize grouped data
 */
export function useMemoizedGroup<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return useMemo(() => {
    const groups = {} as Record<K, T[]>;
    array.forEach((item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    return groups;
  }, [array, keyFn]);
}
