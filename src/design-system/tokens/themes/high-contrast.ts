/**
 * High Contrast Theme Configuration
 * WCAG 2.2 AAA compliant high contrast mode
 * Maximum contrast for accessibility
 */

import { lightTheme } from './light';

export const highContrastTheme = {
  ...lightTheme,
  
  /**
   * High Contrast Color Overrides
   * Pure black and white only - no greys
   */
  colors: {
    ...lightTheme.colors,
    
    // Maximum contrast surfaces
    surface: {
      primary: '#FFFFFF',      // Pure white
      secondary: '#FFFFFF',    // Pure white
      tertiary: '#FFFFFF',     // Pure white
      raised: '#FFFFFF',       // Pure white
      overlay: 'rgba(0, 0, 0, 0.9)',  // Near-black overlay
    },
    
    // Maximum contrast text
    text: {
      primary: '#000000',      // Pure black
      secondary: '#000000',    // Pure black (no grey)
      tertiary: '#000000',     // Pure black
      disabled: '#000000',     // Pure black (with opacity)
      inverse: '#FFFFFF',      // Pure white
      brand: '#000000',        // Black instead of brand colors
      success: '#000000',      // Black for high contrast
      error: '#000000',        // Black for high contrast
    },
    
    // Maximum contrast borders
    border: {
      default: '#000000',      // Pure black borders
      strong: '#000000',       // Pure black
      subtle: '#000000',       // Pure black
      brand: '#000000',        // Pure black
      focus: '#000000',        // Pure black with thick outline
    },
    
    // Interactive elements - pure black/white only
    interactive: {
      primary: {
        default: '#000000',
        hover: '#000000',
        active: '#000000',
        disabled: '#000000',
      },
      secondary: {
        default: '#FFFFFF',
        hover: '#FFFFFF',
        active: '#FFFFFF',
        disabled: '#FFFFFF',
      },
    },
  },
  
  /**
   * High Contrast Border Widths
   * Thicker borders for better visibility
   */
  borderWidth: {
    0: '0',
    default: '2px',    // Thicker default
    2: '3px',
    3: '4px',
    4: '5px',
    8: '8px',
  },
  
  /**
   * High Contrast Shadows
   * Hard, visible shadows only
   */
  shadows: {
    none: 'none',
    xs: '0 0 0 1px rgba(0, 0, 0, 1)',
    sm: '0 0 0 2px rgba(0, 0, 0, 1)',
    base: '0 0 0 3px rgba(0, 0, 0, 1)',
    md: '0 0 0 4px rgba(0, 0, 0, 1)',
    lg: '0 0 0 5px rgba(0, 0, 0, 1)',
    xl: '0 0 0 6px rgba(0, 0, 0, 1)',
    '2xl': '0 0 0 8px rgba(0, 0, 0, 1)',
    inner: 'inset 0 0 0 2px rgba(0, 0, 0, 1)',
    hard: '8px 8px 0 rgba(0, 0, 0, 1)',
    hardInverse: '8px 8px 0 rgba(255, 255, 255, 1)',
  },
} as const;

export type HighContrastTheme = typeof highContrastTheme;
