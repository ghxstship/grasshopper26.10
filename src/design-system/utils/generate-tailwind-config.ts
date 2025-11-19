/**
 * Tailwind Config Generator
 * Generates Tailwind configuration from design tokens
 * Ensures single source of truth
 */

import { colors } from '../tokens/primitives/colors';
import { typography } from '../tokens/primitives/typography';
import { spacing } from '../tokens/primitives/spacing';
import { borders, shadows } from '../tokens/primitives/borders';
import { animations } from '../tokens/primitives/animations';
import { breakpoints } from '../tokens/primitives/breakpoints';

/**
 * Generates Tailwind theme configuration from design tokens
 */
export function generateTailwindTheme() {
  return {
    extend: {
      // Font Families from tokens
      fontFamily: {
        anton: typography.fontFamily.anton.split(',').map(f => f.trim()),
        bebas: typography.fontFamily.bebas.split(',').map(f => f.trim()),
        share: typography.fontFamily.share.split(',').map(f => f.trim()),
        'share-mono': typography.fontFamily.shareMono.split(',').map(f => f.trim()),
      },

      // Font Sizes from tokens
      fontSize: {
        hero: [typography.fontSize.hero, { 
          lineHeight: typography.lineHeight.tight, 
          letterSpacing: typography.letterSpacing.tight,
          fontWeight: typography.fontWeight.normal 
        }],
        h1: [typography.fontSize.h1, { 
          lineHeight: typography.lineHeight.tight, 
          letterSpacing: typography.letterSpacing.tight,
          fontWeight: typography.fontWeight.normal 
        }],
        h2: [typography.fontSize.h2, { 
          lineHeight: typography.lineHeight.snug, 
          letterSpacing: typography.letterSpacing.wide,
          fontWeight: typography.fontWeight.normal 
        }],
        h3: [typography.fontSize.h3, { 
          lineHeight: typography.lineHeight.snug, 
          letterSpacing: typography.letterSpacing.wide,
          fontWeight: typography.fontWeight.normal 
        }],
        h4: [typography.fontSize.h4, { 
          lineHeight: typography.lineHeight.snug, 
          letterSpacing: typography.letterSpacing.normal,
          fontWeight: typography.fontWeight.normal 
        }],
        h5: [typography.fontSize.h5, { 
          lineHeight: typography.lineHeight.normal, 
          letterSpacing: typography.letterSpacing.normal,
          fontWeight: typography.fontWeight.normal 
        }],
        h6: [typography.fontSize.h6, { 
          lineHeight: typography.lineHeight.normal, 
          letterSpacing: typography.letterSpacing.normal,
          fontWeight: typography.fontWeight.normal 
        }],
        'body-lg': [typography.fontSize.bodyLg, { 
          lineHeight: typography.lineHeight.relaxed, 
          letterSpacing: typography.letterSpacing.normal,
          fontWeight: typography.fontWeight.normal 
        }],
        body: [typography.fontSize.body, { 
          lineHeight: typography.lineHeight.relaxed, 
          letterSpacing: typography.letterSpacing.normal,
          fontWeight: typography.fontWeight.normal 
        }],
        'body-sm': [typography.fontSize.bodySm, { 
          lineHeight: typography.lineHeight.normal, 
          letterSpacing: typography.letterSpacing.normal,
          fontWeight: typography.fontWeight.normal 
        }],
        'meta-lg': [typography.fontSize.metaLg, { 
          lineHeight: typography.lineHeight.normal, 
          letterSpacing: typography.letterSpacing.wider,
          fontWeight: typography.fontWeight.normal 
        }],
        meta: [typography.fontSize.meta, { 
          lineHeight: typography.lineHeight.normal, 
          letterSpacing: typography.letterSpacing.wider,
          fontWeight: typography.fontWeight.normal 
        }],
        'meta-sm': [typography.fontSize.metaSm, { 
          lineHeight: typography.lineHeight.tight, 
          letterSpacing: typography.letterSpacing.wider,
          fontWeight: typography.fontWeight.normal 
        }],
        caption: [typography.fontSize.caption, { 
          lineHeight: typography.lineHeight.normal, 
          letterSpacing: typography.letterSpacing.normal,
          fontWeight: typography.fontWeight.normal 
        }],
      },

      // Colors from tokens
      colors: {
        black: colors.black,
        white: colors.white,
        grey: colors.grey,
      },

      // Spacing from tokens
      spacing: spacing,

      // Border Radius from tokens
      borderRadius: borders.radius,

      // Box Shadows from tokens
      boxShadow: shadows,

      // Animation delays
      animationDelay: animations.delay,

      // Breakpoints from tokens
      screens: breakpoints,

      // Z-Index scale
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  };
}
