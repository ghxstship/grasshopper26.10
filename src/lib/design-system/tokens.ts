/**
 * GHXSTSHIP Design System Tokens
 * Contemporary Minimal Pop Art
 * Strict Monochromatic + High Contrast
 */

export const designTokens = {
  // ============================================================================
  // COLOR SYSTEM - Strict Monochromatic
  // ============================================================================
  colors: {
    // Pure Base
    black: '#000000',
    white: '#FFFFFF',
    
    // Grayscale Spectrum
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
    
    // Semantic Colors
    primary: '#000000',
    secondary: '#404040',
    background: '#FFFFFF',
    foreground: '#000000',
    surface: '#F5F5F5',
    border: '#D4D4D4',
    
    // Text Colors
    text: {
      primary: '#000000',
      secondary: '#404040',
      tertiary: '#737373',
      inverse: '#FFFFFF',
      disabled: '#A3A3A3',
    },
    
    // State Colors (Monochrome)
    state: {
      hover: '#171717',
      active: '#000000',
      focus: '#000000',
      disabled: '#E5E5E5',
    },
    
    // Feedback Colors (Minimal)
    feedback: {
      success: '#000000',
      error: '#000000',
      warning: '#000000',
      info: '#000000',
    },
  },

  // ============================================================================
  // TYPOGRAPHY SYSTEM - ANTON / BEBAS NEUE / SHARE TECH
  // ============================================================================
  typography: {
    fonts: {
      display: 'var(--font-anton), Anton, sans-serif',
      heading: 'var(--font-bebas-neue), "Bebas Neue", sans-serif',
      body: 'var(--font-share-tech), "Share Tech", monospace',
      mono: 'var(--font-share-tech-mono), "Share Tech Mono", monospace',
    },
    
    // Display Typography (ANTON - All Caps)
    hero: {
      fontSize: '6rem',      // 96px
      lineHeight: '1',
      fontWeight: '400',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
    
    display: {
      fontSize: '4.5rem',    // 72px
      lineHeight: '1',
      fontWeight: '400',
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
    },
    
    // Heading Typography (BEBAS NEUE)
    h1: {
      fontSize: '3.75rem',   // 60px
      lineHeight: '1.1',
      fontWeight: '400',
      letterSpacing: '0.02em',
    },
    
    h2: {
      fontSize: '3rem',      // 48px
      lineHeight: '1.2',
      fontWeight: '400',
      letterSpacing: '0.02em',
    },
    
    h3: {
      fontSize: '2.25rem',   // 36px
      lineHeight: '1.3',
      fontWeight: '400',
      letterSpacing: '0.02em',
    },
    
    h4: {
      fontSize: '1.875rem',  // 30px
      lineHeight: '1.4',
      fontWeight: '400',
      letterSpacing: '0.02em',
    },
    
    h5: {
      fontSize: '1.5rem',    // 24px
      lineHeight: '1.4',
      fontWeight: '400',
      letterSpacing: '0.02em',
    },
    
    h6: {
      fontSize: '1.25rem',   // 20px
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0.02em',
    },
    
    // Body Typography (SHARE TECH)
    bodyLarge: {
      fontSize: '1.125rem',  // 18px
      lineHeight: '1.6',
      fontWeight: '400',
      letterSpacing: '0.01em',
    },
    
    body: {
      fontSize: '1rem',      // 16px
      lineHeight: '1.6',
      fontWeight: '400',
      letterSpacing: '0.01em',
    },
    
    bodySmall: {
      fontSize: '0.875rem',  // 14px
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0.01em',
    },
    
    // Utility Typography
    caption: {
      fontSize: '0.75rem',   // 12px
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0.02em',
    },
    
    overline: {
      fontSize: '0.625rem',  // 10px
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
    },
  },

  // ============================================================================
  // SPACING SYSTEM - 8px Base Grid
  // ============================================================================
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    32: '8rem',      // 128px
    40: '10rem',     // 160px
    48: '12rem',     // 192px
    56: '14rem',     // 224px
    64: '16rem',     // 256px
  },

  // ============================================================================
  // BORDER SYSTEM - Sharp, Brutalist
  // ============================================================================
  borders: {
    width: {
      none: '0',
      thin: '1px',
      medium: '2px',
      thick: '4px',
      heavy: '8px',
    },
    radius: {
      none: '0',
      sm: '0.125rem',   // 2px - minimal
      md: '0.25rem',    // 4px - subtle
      lg: '0.5rem',     // 8px - moderate
      full: '9999px',   // circular
    },
    style: {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
    },
  },

  // ============================================================================
  // SHADOW SYSTEM - High Contrast
  // ============================================================================
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    brutal: '8px 8px 0 0 rgba(0, 0, 0, 1)',      // Brutalist shadow
    brutalHover: '12px 12px 0 0 rgba(0, 0, 0, 1)', // Hover state
  },

  // ============================================================================
  // ANIMATION SYSTEM - Snappy, Precise
  // ============================================================================
  animation: {
    duration: {
      instant: '50ms',
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },

  // ============================================================================
  // BREAKPOINTS - Mobile First
  // ============================================================================
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ============================================================================
  // Z-INDEX SYSTEM - Layering
  // ============================================================================
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    toast: 1700,
  },
} as const;

export type DesignTokens = typeof designTokens;
