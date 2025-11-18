/**
 * Throttle Hook
 * Limits how often a value can update
 */

'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Hook that throttles a value
 * 
 * @param value - The value to throttle
 * @param interval - Minimum time between updates in milliseconds
 * @returns The throttled value
 * 
 * @example
 * ```tsx
 * const [scrollPosition, setScrollPosition] = useState(0);
 * const throttledScrollPosition = useThrottle(scrollPosition, 100);
 * 
 * useEffect(() => {
 *   // This will only run at most once every 100ms
 *   updateScrollIndicator(throttledScrollPosition);
 * }, [throttledScrollPosition]);
 * ```
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (timeSinceLastExecution >= interval) {
      lastExecuted.current = now;
      // Use setTimeout to avoid setState in effect
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
      }, 0);
    } else {
      timeoutRef.current = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastExecution);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, interval]);

  return throttledValue;
}
