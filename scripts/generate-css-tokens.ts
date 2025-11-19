#!/usr/bin/env ts-node
/**
 * Generate CSS Custom Properties from TypeScript Design Tokens
 * Single Source of Truth: TypeScript tokens → CSS variables
 */

import * as fs from 'fs';
import * as path from 'path';
import { colors, semanticColors } from '../src/design-system/tokens/primitives/colors';
import { typography, typographySemantics } from '../src/design-system/tokens/primitives/typography';
import { spacing } from '../src/design-system/tokens/primitives/spacing';
import { borders, shadows } from '../src/design-system/tokens/primitives/borders';
import { animations } from '../src/design-system/tokens/primitives/animations';

/**
 * Generate CSS custom properties from token objects
 */
function generateCSSVariables(): string {
  let css = `/**
 * AUTO-GENERATED CSS CUSTOM PROPERTIES
 * DO NOT EDIT MANUALLY - Generated from TypeScript design tokens
 * Source: src/design-system/tokens/
 * Generated: ${new Date().toISOString()}
 */

:root {
  /* ============================================ */
  /* GHXSTSHIP MONOCHROMATIC SYSTEM             */
  /* Pure Black, Pure White, 9 Grey Tones ONLY  */
  /* NO COLOR UNDER ANY CIRCUMSTANCES           */
  /* ============================================ */
  
  /* Primary Colors - ONLY black and white */
  --color-black: ${colors.black};
  --color-white: ${colors.white};
  
  /* Greyscale Spectrum - 9 tones */
`;

  // Generate grey scale
  Object.entries(colors.grey).forEach(([key, value]) => {
    const comment = getGreyComment(key);
    css += `  --grey-${key}: ${value};${comment ? `  /* ${comment} */` : ''}\n`;
  });

  css += `
  /* Semantic Tokens - Monochrome only */
`;

  // Generate semantic surface colors
  Object.entries(semanticColors.surface).forEach(([key, value]) => {
    css += `  --surface-${key}: ${value};\n`;
  });

  // Generate semantic text colors
  Object.entries(semanticColors.text).forEach(([key, value]) => {
    css += `  --text-${key}: ${value};\n`;
  });

  // Generate semantic border colors
  Object.entries(semanticColors.border).forEach(([key, value]) => {
    css += `  --border-${key}: ${value};\n`;
  });

  // Legacy semantic tokens for backwards compatibility
  css += `
  /* Legacy Semantic Tokens (for backwards compatibility) */
  --background: var(--surface-primary);
  --foreground: var(--text-primary);
  --surface: var(--surface-secondary);
  --surface-dark: ${colors.grey[900]};
  --border: var(--border-default);
  --border-strong: var(--border-strong);
  --text-secondary: var(--text-secondary);
  --text-muted: var(--text-metadata);
  --text-inverse: var(--text-inverse);

  /* ============================================ */
  /* TYPOGRAPHY SYSTEM - Semantic Design Tokens  */
  /* ============================================ */
`;

  // Generate typography tokens for each semantic level
  Object.entries(typographySemantics).forEach(([level, config]) => {
    const levelName = level === 'bodyLg' ? 'body-lg' : level === 'bodySm' ? 'body-sm' : level;
    css += `
  /* ${level.toUpperCase()} Typography */
  --font-size-${levelName}: ${config.fontSize};
  --line-height-${levelName}: ${config.lineHeight};
  --letter-spacing-${levelName}: ${config.letterSpacing};
  --font-weight-${levelName}: ${config.fontWeight};
`;
  });

  css += `
  /* ============================================ */
  /* SPACING SYSTEM                              */
  /* ============================================ */
`;

  // Generate spacing tokens
  Object.entries(spacing).forEach(([key, value]) => {
    css += `  --space-${key}: ${value};\n`;
  });

  css += `
  /* ============================================ */
  /* BORDERS & RADIUS                            */
  /* ============================================ */
`;

  // Generate border radius
  Object.entries(borders.radius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });

  // Generate border widths
  Object.entries(borders.width).forEach(([key, value]) => {
    css += `  --border-width-${key}: ${value};\n`;
  });

  css += `
  /* ============================================ */
  /* SHADOWS & ELEVATION                         */
  /* ============================================ */
`;

  // Generate shadows
  Object.entries(shadows).forEach(([category, values]) => {
    if (typeof values === 'object') {
      Object.entries(values).forEach(([key, value]) => {
        css += `  --shadow-${category}-${key}: ${value};\n`;
      });
    }
  });

  css += `
  /* ============================================ */
  /* ANIMATIONS & TRANSITIONS                    */
  /* ============================================ */
`;

  // Generate animation tokens
  Object.entries(animations.duration).forEach(([key, value]) => {
    css += `  --duration-${key}: ${value};\n`;
  });

  Object.entries(animations.easing).forEach(([key, value]) => {
    css += `  --easing-${key}: ${value};\n`;
  });

  css += `}

/* ============================================ */
/* RESPONSIVE TYPOGRAPHY                       */
/* ============================================ */

/* Mobile (max-width: 640px) */
@media (max-width: 640px) {
  :root {
    --font-size-hero: clamp(3rem, 10vw, 4rem);
    --font-size-display: clamp(2.5rem, 8vw, 3.5rem);
    --font-size-h1: clamp(2.25rem, 6vw, 3rem);
    --font-size-h2: clamp(1.75rem, 5vw, 2.5rem);
    --font-size-h3: clamp(1.5rem, 4vw, 2rem);
    --font-size-h4: clamp(1.25rem, 3vw, 1.75rem);
    --font-size-h5: clamp(1.125rem, 2.5vw, 1.5rem);
    --font-size-h6: clamp(1rem, 2vw, 1.25rem);
  }
}

/* Tablet (641px - 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  :root {
    --font-size-hero: clamp(4.5rem, 10vw, 6rem);
    --font-size-display: clamp(3.5rem, 8vw, 5rem);
    --font-size-h1: clamp(3rem, 6vw, 4rem);
    --font-size-h2: clamp(2.5rem, 5vw, 3rem);
    --font-size-h3: clamp(2rem, 4vw, 2.5rem);
    --font-size-h4: clamp(1.75rem, 3vw, 2rem);
  }
}
`;

  return css;
}

function getGreyComment(key: string): string {
  const comments: Record<string, string> = {
    '100': 'Lightest grey - subtle backgrounds',
    '200': 'Light grey - borders, dividers',
    '300': 'Mid-light grey - secondary borders',
    '400': 'Medium grey - secondary text',
    '500': 'Mid grey - tertiary text',
    '600': 'Mid-dark grey - metadata text',
    '700': 'Dark grey - subtle backgrounds',
    '800': 'Darker grey - near-black backgrounds',
    '900': 'Almost black - deep backgrounds',
  };
  return comments[key] || '';
}

/**
 * Generate the complete globals.css file
 */
function generateGlobalCSS(): string {
  const cssVariables = generateCSSVariables();
  
  return `@import "tailwindcss";

${cssVariables}

/* ============================================ */
/* THEME CONFIGURATION                         */
/* ============================================ */

@theme inline {
  --color-background: var(--surface-primary);
  --color-foreground: var(--text-primary);
  --font-sans: var(--font-share-tech);
  --font-mono: var(--font-share-tech-mono);
}

/* ============================================ */
/* BASE STYLES                                 */
/* ============================================ */

body {
  background: var(--surface-primary);
  color: var(--text-primary);
  font-family: var(--font-share-tech), 'Share Tech', monospace;
  font-size: var(--font-size-body);
  line-height: var(--line-height-body);
  font-weight: var(--font-weight-body);
  letter-spacing: var(--letter-spacing-body);
}

/* ============================================ */
/* BRAND TEXT GRADIENTS                        */
/* ============================================ */

.gvteway-text-gradient {
  font-family: var(--font-anton), 'Anton', sans-serif !important;
  font-size: var(--font-size-hero);
  line-height: var(--line-height-hero);
  font-weight: var(--font-weight-hero);
  letter-spacing: var(--letter-spacing-hero);
  background: linear-gradient(135deg, #FF0000 0%, #FFD700 50%, #0066FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.atlvs-text-gradient {
  font-family: var(--font-anton), 'Anton', sans-serif !important;
  font-size: var(--font-size-hero);
  line-height: var(--line-height-hero);
  font-weight: var(--font-weight-hero);
  letter-spacing: var(--letter-spacing-hero);
  background: linear-gradient(135deg, #00FF00 0%, #FF8800 50%, #8800FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.compvss-text-gradient {
  font-family: var(--font-anton), 'Anton', sans-serif !important;
  font-size: var(--font-size-hero);
  line-height: var(--line-height-hero);
  font-weight: var(--font-weight-hero);
  letter-spacing: var(--letter-spacing-hero);
  background: linear-gradient(135deg, #00FFFF 0%, #FF00FF 50%, #4B0082 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ============================================ */
/* UTILITY CLASSES                             */
/* ============================================ */

.section-padding {
  padding: 6rem 0;
}

@media (max-width: 768px) {
  .section-padding {
    padding: 3rem 0;
  }
}

/* ============================================ */
/* ACCESSIBILITY                               */
/* ============================================ */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 3px solid var(--text-primary);
  outline-offset: 2px;
}

/* ============================================ */
/* REDUCED MOTION                              */
/* ============================================ */

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ============================================ */
/* HIGH CONTRAST MODE                          */
/* ============================================ */

@media (prefers-contrast: high) {
  :root {
    --border-default: var(--color-black);
    --text-secondary: var(--color-black);
  }
}
`;
}

// Main execution
const outputPath = path.join(process.cwd(), 'src/app/globals.css');
const generatedCSS = generateGlobalCSS();

fs.writeFileSync(outputPath, generatedCSS, 'utf-8');

console.log('✅ Generated globals.css from TypeScript tokens');
console.log(`📄 Output: ${outputPath}`);
console.log(`📊 Generated ${generatedCSS.split('\n').length} lines of CSS`);
