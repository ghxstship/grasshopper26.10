/**
 * Theme Hook
 * Provides access to current theme and theme switching
 */

'use client';

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'high-contrast';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as Theme | null;
      return stored || 'light';
    }
    return 'light';
  });
  const mounted = true;

  useEffect(() => {
    document.documentElement.classList.add(theme);
  }, [theme]);

  const updateTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove('light', 'dark', 'high-contrast');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return {
    theme,
    setTheme: updateTheme,
    mounted,
  };
}
