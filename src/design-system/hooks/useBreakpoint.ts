/**
 * Breakpoint Hook
 * Provides responsive breakpoint detection
 */

'use client';

import { useEffect, useState } from 'react';
import { breakpoints } from '../tokens/primitives/breakpoints';

export type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('sm');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= parseInt(breakpoints['2xl'])) {
        setCurrentBreakpoint('2xl');
      } else if (width >= parseInt(breakpoints.xl)) {
        setCurrentBreakpoint('xl');
      } else if (width >= parseInt(breakpoints.lg)) {
        setCurrentBreakpoint('lg');
      } else if (width >= parseInt(breakpoints.md)) {
        setCurrentBreakpoint('md');
      } else {
        setCurrentBreakpoint('sm');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    current: currentBreakpoint,
    isSmall: currentBreakpoint === 'sm',
    isMedium: currentBreakpoint === 'md',
    isLarge: currentBreakpoint === 'lg',
    isXLarge: currentBreakpoint === 'xl',
    is2XLarge: currentBreakpoint === '2xl',
  };
}
