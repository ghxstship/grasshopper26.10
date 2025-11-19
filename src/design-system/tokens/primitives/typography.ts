/**
 * Typography Tokens
 * Four-Font System for Contemporary Minimal Pop Art Aesthetic
 * 
 * Font Stack:
 * - ANTON: Display & H1 (Maximum impact headlines, hero statements)
 * - BEBAS NEUE: H2-H6 (Section headers, navigation, labels)
 * - SHARE TECH: Body Copy (All body text, paragraphs, descriptions)
 * - SHARE TECH MONO: Metadata & Labels (Dates, tags, technical info, captions)
 */

export const typography = {
  // Font Families
  fontFamily: {
    anton: 'var(--font-anton), Anton, Impact, Arial Black, sans-serif',
    bebas: 'var(--font-bebas), Bebas Neue, Arial Narrow, Arial, sans-serif',
    share: 'var(--font-share-tech), Share Tech, Monaco, Consolas, monospace',
    shareMono: 'var(--font-share-tech-mono), Share Tech Mono, Courier New, Courier, monospace',
  },
  
  // Font Sizes (Fluid Typography with clamp)
  fontSize: {
    // ANTON sizes (Display & H1)
    hero: 'clamp(3rem, 10vw, 7.5rem)',      // 48px → 120px
    display: 'clamp(2.5rem, 8vw, 6rem)',    // 40px → 96px
    h1: 'clamp(2.25rem, 6vw, 5rem)',        // 36px → 80px
    
    // BEBAS NEUE sizes (H2-H6)
    h2: 'clamp(1.75rem, 5vw, 3.5rem)',      // 28px → 56px
    h3: 'clamp(1.5rem, 4vw, 2.5rem)',       // 24px → 40px
    h4: 'clamp(1.25rem, 3vw, 2rem)',        // 20px → 32px
    h5: 'clamp(1.125rem, 2.5vw, 1.5rem)',   // 18px → 24px
    h6: 'clamp(1rem, 2vw, 1.25rem)',        // 16px → 20px
    
    // SHARE TECH sizes (Body)
    bodyLg: 'clamp(1.0625rem, 2vw, 1.25rem)',  // 17px → 20px
    body: 'clamp(0.9375rem, 1.5vw, 1.125rem)', // 15px → 18px
    bodySm: 'clamp(0.875rem, 1.3vw, 1rem)',    // 14px → 16px
    
    // SHARE TECH MONO sizes (Metadata)
    metaLg: 'clamp(0.8125rem, 1.4vw, 1rem)',   // 13px → 16px
    meta: 'clamp(0.75rem, 1.2vw, 0.875rem)',   // 12px → 14px
    metaSm: 'clamp(0.6875rem, 1.1vw, 0.8125rem)', // 11px → 13px
    caption: 'clamp(0.75rem, 1.2vw, 0.875rem)',   // 12px → 14px
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.05',
    snug: '1.15',
    normal: '1.5',
    relaxed: '1.7',
    loose: '2',
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Text Transform
  textTransform: {
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
    none: 'none',
  },
} as const;

/**
 * Semantic Typography Configurations
 * Complete typography specifications for each semantic level
 */
export const typographySemantics = {
  hero: {
    fontFamily: typography.fontFamily.anton,
    fontSize: typography.fontSize.hero,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.none,
    letterSpacing: typography.letterSpacing.tight,
    textTransform: typography.textTransform.uppercase,
  },
  
  display: {
    fontFamily: typography.fontFamily.anton,
    fontSize: typography.fontSize.display,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    textTransform: typography.textTransform.uppercase,
  },
  
  h1: {
    fontFamily: typography.fontFamily.anton,
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
    textTransform: typography.textTransform.uppercase,
  },
  
  h2: {
    fontFamily: typography.fontFamily.bebas,
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.snug,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: typography.textTransform.uppercase,
  },
  
  h3: {
    fontFamily: typography.fontFamily.bebas,
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.snug,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: typography.textTransform.uppercase,
  },
  
  h4: {
    fontFamily: typography.fontFamily.bebas,
    fontSize: typography.fontSize.h4,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: typography.textTransform.none,
  },
  
  h5: {
    fontFamily: typography.fontFamily.bebas,
    fontSize: typography.fontSize.h5,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: typography.textTransform.none,
  },
  
  h6: {
    fontFamily: typography.fontFamily.bebas,
    fontSize: typography.fontSize.h6,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: typography.textTransform.none,
  },
  
  bodyLg: {
    fontFamily: typography.fontFamily.share,
    fontSize: typography.fontSize.bodyLg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
    textTransform: typography.textTransform.none,
  },
  
  body: {
    fontFamily: typography.fontFamily.share,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.relaxed,
    letterSpacing: typography.letterSpacing.normal,
    textTransform: typography.textTransform.none,
  },
  
  bodySm: {
    fontFamily: typography.fontFamily.share,
    fontSize: typography.fontSize.bodySm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.normal,
    textTransform: typography.textTransform.none,
  },
  
  meta: {
    fontFamily: typography.fontFamily.shareMono,
    fontSize: typography.fontSize.meta,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: typography.textTransform.uppercase,
  },
  
  caption: {
    fontFamily: typography.fontFamily.shareMono,
    fontSize: typography.fontSize.caption,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: typography.textTransform.none,
  },
} as const;

export type Typography = typeof typography;
export type TypographySemantics = typeof typographySemantics;
