/**
 * Border & Shadow Tokens
 * The design system uses hard geometric borders and shadows
 * No soft drop shadows - only hard offset shadows for Pop Art aesthetic
 */

export const borders = {
  // Border Widths
  width: {
    none: '0',
    hairline: '1px',
    thin: '2px',
    base: '3px',
    thick: '4px',
    heavy: '8px',
  },
  
  // Border Radius
  radius: {
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
  
  // Border Styles
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    none: 'none',
  },
} as const;

/**
 * Shadow System
 * The design system uses hard geometric shadows, not soft drop shadows
 * Offset shadows for Pop Art/screen print aesthetic
 */
export const shadows = {
  // Hard Offset Shadows
  hard: {
    sm: '4px 4px 0 #000000',
    base: '8px 8px 0 #000000',
    lg: '12px 12px 0 #000000',
    xl: '16px 16px 0 #000000',
  },
  
  // Hard Offset Shadows (Inverse - for dark backgrounds)
  hardInverse: {
    sm: '4px 4px 0 #FFFFFF',
    base: '8px 8px 0 #FFFFFF',
    lg: '12px 12px 0 #FFFFFF',
    xl: '16px 16px 0 #FFFFFF',
  },
  
  // Subtle Outline (not a shadow-hard-hard, but used similarly)
  outline: {
    thin: '0 0 0 1px rgba(0, 0, 0, 0.1)',
    base: '0 0 0 2px rgba(0, 0, 0, 0.1)',
    thick: '0 0 0 3px rgba(0, 0, 0, 0.1)',
  },
  
  // Focus Indicators
  focus: {
    default: '0 0 0 3px #000000',
    inverse: '0 0 0 3px #FFFFFF',
  },
  
  // None
  none: 'none',
} as const;

export type Borders = typeof borders;
export type Shadows = typeof shadows;
