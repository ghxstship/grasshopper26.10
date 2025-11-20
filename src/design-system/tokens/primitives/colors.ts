/**
 * Monochromatic Color Tokens
 * Contemporary Minimal Pop Art Aesthetic
 * 
 * CRITICAL RULE: uses ONLY black, white, and greyscale.
 * No color under any circumstances for brand elements.
 * 
 * This is the single source of truth for all color tokens.
 * All components must use these tokens exclusively.
 */

export const colors = {
  // Pure Base Colors
  black: '#000000',
  white: '#FFFFFF',
  
  // Greyscale Spectrum (9 shades)
  grey: {
    100: '#F5F5F5',  // Lightest grey - subtle backgrounds
    200: '#E5E5E5',  // Light grey - borders, dividers
    300: '#D4D4D4',  // Mid-light grey - secondary borders
    400: '#A3A3A3',  // Medium grey - secondary text
    500: '#737373',  // Mid grey - tertiary text
    600: '#525252',  // Mid-dark grey - metadata text
    700: '#404040',  // Dark grey - subtle backgrounds
    800: '#262626',  // Darker grey - near-black backgrounds
    900: '#171717',  // Almost black - deep backgrounds
  },
} as const;

/**
 * Semantic Color Assignments for GHXSTSHIP
 * Purpose-driven color tokens that map to primitive colors
 */
export const semanticColors = {
  // Surface Colors
  surface: {
    primary: colors.white,
    secondary: colors.grey[100],
    tertiary: colors.grey[200],
    inverse: colors.black,
    raised: colors.white,
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text Colors
  text: {
    primary: colors.black,
    secondary: colors.grey[400],
    tertiary: colors.grey[500],
    metadata: colors.grey[600],
    disabled: colors.grey[300],
    inverse: colors.white,
  },
  
  // Border Colors (BRUTALIST: favor bold black borders)
  border: {
    default: colors.black,        // Changed: bold black default
    subtle: colors.grey[200],     // Subtle when needed
    strong: colors.black,         // Emphasis
    inverse: colors.white,
    light: colors.grey[200],      // Legacy support
  },
  
  // Interactive States
  interactive: {
    default: colors.black,
    hover: colors.white,
    active: colors.grey[900],
    disabled: colors.grey[300],
  },
} as const;

export type Colors = typeof colors;
export type SemanticColors = typeof semanticColors;
