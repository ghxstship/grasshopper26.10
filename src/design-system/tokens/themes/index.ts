/**
 * Theme System
 * Export all theme configurations
 */

export { lightTheme, type Theme } from './light';
export { darkTheme, type DarkTheme } from './dark';
export { highContrastTheme, type HighContrastTheme } from './high-contrast';

/**
 * Theme Type Union
 */
export type ThemeVariant = 'light' | 'dark' | 'high-contrast';

/**
 * Get theme by variant name
 */
import { lightTheme } from './light';
import { darkTheme } from './dark';
import { highContrastTheme } from './high-contrast';

export function getTheme(variant: ThemeVariant) {
  switch (variant) {
    case 'light':
      return lightTheme;
    case 'dark':
      return darkTheme;
    case 'high-contrast':
      return highContrastTheme;
    default:
      return lightTheme;
  }
}
