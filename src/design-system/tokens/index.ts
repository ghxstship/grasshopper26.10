/**
 * Design System Tokens - Single Source of Truth
 * Contemporary Minimal Pop Art Design System
 * 
 * All design tokens are defined here and auto-generate CSS custom properties.
 */

// Core Design Tokens (Single Source of Truth)
export * from './primitives/colors';
export * from './primitives/typography';
export * from './primitives/spacing';
export * from './primitives/borders';
export * from './primitives/animations';
export * from './primitives/breakpoints';

// Re-export for convenience
import { colors, semanticColors } from './primitives/colors';
import { typography, typographySemantics } from './primitives/typography';
import { spacing } from './primitives/spacing';
import { borders, shadows } from './primitives/borders';
import { animations } from './primitives/animations';
import { breakpoints, media } from './primitives/breakpoints';

/**
 * Unified Token Export
 * Single source of truth for all design tokens
 */
export const tokens = {
  colors,
  semanticColors,
  typography,
  typographySemantics,
  spacing,
  borders,
  shadows,
  animations,
  breakpoints,
  media,
} as const;

export type Tokens = typeof tokens;
