/**
 * Dark Theme Configuration
 * Dark mode variant with inverted colors
 * Maintains GHXSTSHIP high-contrast principles
 */

import { lightTheme } from './light';

export const darkTheme = {
  ...lightTheme,
  
  /**
   * Dark Mode Color Overrides
   * Inverted semantic colors for dark backgrounds
   */
  colors: {
    ...lightTheme.colors,
    
    // Override surface colors for dark mode
    surface: {
      primary: '#000000',      // Pure black background
      secondary: '#171717',    // Near-black
      tertiary: '#262626',     // Dark grey
      raised: '#171717',       // Elevated surfaces
      overlay: 'rgba(255, 255, 255, 0.1)',  // Light overlay
    },
    
    // Override text colors for dark mode
    text: {
      primary: '#FFFFFF',      // Pure white text
      secondary: '#D4D4D4',    // Light grey
      tertiary: '#A3A3A3',     // Medium grey
      disabled: '#737373',     // Darker grey
      inverse: '#000000',      // Black text (on light surfaces)
      brand: '#000000',        // Keep brand colors
      success: '#000000',
      error: '#000000',
    },
    
    // Override border colors for dark mode
    border: {
      default: '#404040',      // Dark border
      strong: '#525252',       // Stronger dark border
      subtle: '#262626',       // Subtle dark border
      brand: '#000000',
      focus: '#000000',
    },
  },
  
  /**
   * Dark Mode Shadow Adjustments
   * Lighter shadows for dark backgrounds
   */
  shadows: {
    ...lightTheme.shadows,
    xs: '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
    sm: '0 1px 3px 0 rgba(255, 255, 255, 0.1), 0 1px 2px -1px rgba(255, 255, 255, 0.1)',
    base: '0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -2px rgba(255, 255, 255, 0.1)',
    md: '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -4px rgba(255, 255, 255, 0.1)',
    lg: '0 20px 25px -5px rgba(255, 255, 255, 0.1), 0 8px 10px -6px rgba(255, 255, 255, 0.1)',
    xl: '0 25px 50px -12px rgba(255, 255, 255, 0.15)',
    '2xl': '0 25px 50px -12px rgba(255, 255, 255, 0.15)',
    inner: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.05)',
    // Hard geometric shadows for dark mode
    hard: '8px 8px 0 rgba(255, 255, 255, 1)',
    hardInverse: '8px 8px 0 rgba(0, 0, 0, 1)',
  },
} as const;

export type DarkTheme = typeof darkTheme;
