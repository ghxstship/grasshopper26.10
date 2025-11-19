/**
 * Light Theme Configuration
 * Default theme with comprehensive token definitions
 * Follows GHXSTSHIP monochromatic design principles
 */

import { semanticColors } from '../semantic/colors';
import { spacing } from '../primitives/spacing';
import { typography } from '../primitives/typography';

export const lightTheme = {
  colors: semanticColors,
  spacing,
  typography,
  
  /**
   * Shadow System
   * Hard geometric shadows preferred over soft drop shadows
   */
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    // Hard geometric shadows (GHXSTSHIP style)
    hard: '8px 8px 0 rgba(0, 0, 0, 1)',
    hardInverse: '8px 8px 0 rgba(255, 255, 255, 1)',
  },
  
  /**
   * Border Radius System
   */
  borderRadius: {
    none: '0',
    sm: '0.125rem',    // 2px
    base: '0.25rem',   // 4px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',   // 24px
    full: '9999px',
  },
  
  /**
   * Border Width System
   */
  borderWidth: {
    0: '0',
    default: '1px',
    2: '2px',
    3: '3px',  // GHXSTSHIP thick borders
    4: '4px',
    8: '8px',
  },
  
  /**
   * Opacity Scale
   */
  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    90: '0.9',
    95: '0.95',
    100: '1',
  },
  
  /**
   * Z-Index Scale
   * Systematic layering for UI elements
   */
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
  
  /**
   * Transition System
   * Durations and timing functions for animations
   */
  transitions: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      base: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    timing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
  
  /**
   * Elevation System
   * For layering and depth perception
   */
  elevation: {
    0: { shadowHard: 'none', zIndex: 0 },
    1: { shadowHard: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', zIndex: 10 },
    2: { shadowHard: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', zIndex: 20 },
    3: { shadowHard: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 30 },
    4: { shadowHard: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 40 },
    5: { shadowHard: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', zIndex: 50 },
  },
} as const;

export type Theme = typeof lightTheme;
