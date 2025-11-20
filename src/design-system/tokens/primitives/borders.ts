/**
 * Border & Shadow Tokens
 * The design system uses hard geometric borders and shadows
 * NEOBRUTALIST AESTHETIC: Sharp edges, bold borders, flat design
 */

export const borders = {
  // Border Widths (Brutalist: favor bold borders)
  width: {
    none: '0',
    hairline: '1px',
    thin: '2px',
    base: '3px',        // Standard brutalist border
    thick: '4px',       // Emphasized elements
    heavy: '6px',       // Hero elements
    ultra: '8px',       // Maximum impact
  },
  
  // Border Radius (Brutalist: minimal rounding for geometric precision)
  radius: {
    none: '0',          // DEFAULT for brutalist
    sm: '0.125rem',     // 2px - subtle softening only
    base: '0.25rem',    // 4px - minimal rounding
    md: '0.375rem',     // 6px - use sparingly
    lg: '0.5rem',       // 8px - interactive elements only
    xl: '0.75rem',      // 12px - deprecated
    '2xl': '1rem',      // 16px - deprecated
    '3xl': '1.5rem',    // 24px - deprecated
    full: '9999px',     // Circles/pills only
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
 * NEOBRUTALIST: Flat design with optional hard offset shadows
 * No soft shadows - geometric offset shadows only for depth
 */
export const shadows = {
  // Flat Design (PRIMARY - use for most elements)
  none: 'none',
  flat: 'none',
  
  // Hard Offset Shadows (SECONDARY - use for elevated cards only)
  hard: {
    sm: '2px 2px 0 #000000',      // Minimal depth
    base: '4px 4px 0 #000000',    // Standard depth
    lg: '6px 6px 0 #000000',      // Elevated
    xl: '8px 8px 0 #000000',      // Hero elements
  },
  
  // Hard Offset Shadows (Inverse - for dark backgrounds)
  hardInverse: {
    sm: '2px 2px 0 #FFFFFF',
    base: '4px 4px 0 #FFFFFF',
    lg: '6px 6px 0 #FFFFFF',
    xl: '8px 8px 0 #FFFFFF',
  },
  
  // Colored Offset Shadows (for platform variants)
  hardColor: {
    gvteway: '4px 4px 0 rgba(255, 0, 0, 0.2)',
    compvss: '4px 4px 0 rgba(0, 206, 209, 0.2)',
    atlvs: '4px 4px 0 rgba(0, 255, 0, 0.2)',
  },
  
  // Focus Indicators (Bold for brutalist)
  focus: {
    default: '0 0 0 3px #000000',
    inverse: '0 0 0 3px #FFFFFF',
    ring: '0 0 0 2px #FFFFFF, 0 0 0 4px #000000',
  },
  
  // Deprecated soft shadows (for backward compatibility)
  legacy: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
} as const;

export type Borders = typeof borders;
export type Shadows = typeof shadows;
