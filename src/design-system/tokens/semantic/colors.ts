/**
 * Semantic Color System
 * Maps primitive colors to semantic usage
 * Follows GHXSTSHIP monochromatic design principles
 */

import { colors } from '../primitives/colors';

export const semanticColors = {
  // Base colors
  background: {
    primary: colors.white,
    secondary: colors.grey[100],
    tertiary: colors.grey[900],
    inverse: colors.black,
  },
  
  // Text colors
  text: {
    primary: colors.black,
    secondary: colors.grey[600],
    tertiary: colors.grey[500],
    inverse: colors.white,
    disabled: colors.grey[300],
  },
  
  // Border colors
  border: {
    default: colors.grey[200],
    strong: colors.black,
    subtle: colors.grey[300],
    inverse: colors.white,
  },
  
  // Interactive states
  interactive: {
    default: colors.black,
    hover: colors.grey[800],
    active: colors.grey[900],
    disabled: colors.grey[300],
    inverse: colors.white,
  },
  
  // Status colors (using greyscale)
  status: {
    success: colors.grey[700],
    warning: colors.grey[600],
    error: colors.grey[900],
    info: colors.grey[500],
  },
  
  // Platform variants
  gvteway: {
    primary: colors.black,
    secondary: colors.grey[800],
    accent: colors.grey[600],
  },
  
  compvss: {
    primary: colors.black,
    secondary: colors.grey[800],
    accent: colors.grey[600],
  },
  
  atlvs: {
    primary: colors.black,
    secondary: colors.grey[800],
    accent: colors.grey[600],
  },
} as const;

export type SemanticColors = typeof semanticColors;
