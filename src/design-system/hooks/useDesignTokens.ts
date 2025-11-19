/**
 * Design Tokens Hook
 * Provides programmatic access to design tokens
 */

'use client';

import { tokens } from '../tokens';

export function useDesignTokens() {
  return {
    tokens,
    colors: tokens.colors,
    semanticColors: tokens.semanticColors,
    typography: tokens.typography,
    spacing: tokens.spacing,
    borders: tokens.borders,
    shadows: tokens.shadows,
    animations: tokens.animations,
    breakpoints: tokens.breakpoints,
  };
}
