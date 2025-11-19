# GHXSTSHIP Design System Implementation Guide

**Contemporary Minimal Pop Art Aesthetic**  
**Version 1.0 | November 2025**

---

## 🎯 Zero Tolerance Policy

This design system is **mandatory** for all code in the Grasshopper26.10 repository. Violations will be automatically detected and must be fixed immediately.

### Critical Rules

1. **MONOCHROMATIC ONLY**: Use ONLY black (#000000), white (#FFFFFF), and greyscale (grey-100 through grey-900)
2. **NO RAW TYPOGRAPHY**: Always use Typography components (HeroTitle, SectionHeader, BodyText, etc.)
3. **NO RAW HTML ELEMENTS**: Use atomic design components (Card, Button, Input, etc.)
4. **NO SOFT SHADOWS**: Only hard geometric shadows (shadow-hard, shadow-hard-inverse)
5. **NO COLOR GRADIENTS**: Except for text gradients on platform brand marks (gvteway, atlvs, compvss)

---

## 🎨 Color System

### Monochromatic Palette

```typescript
// Primary Colors
black: '#000000'
white: '#FFFFFF'

// Greyscale Spectrum
grey-100: '#F5F5F5'  // Lightest - subtle backgrounds
grey-200: '#E5E5E5'  // Light - borders, dividers
grey-300: '#D4D4D4'  // Mid-light - secondary borders
grey-400: '#A3A3A3'  // Medium - secondary text
grey-500: '#737373'  // Mid - tertiary text
grey-600: '#525252'  // Mid-dark - metadata text
grey-700: '#404040'  // Dark - subtle backgrounds
grey-800: '#262626'  // Darker - near-black backgrounds
grey-900: '#171717'  // Almost black - deep backgrounds
```

### Usage Examples

```tsx
// ✅ CORRECT
<div className="bg-black text-white">
<div className="bg-white text-black border-2 border-black">
<div className="bg-grey-100 text-grey-900">
<p className="text-grey-600">Metadata text</p>

// ❌ WRONG
<div className="bg-blue-500 text-white">
<div className="bg-gradient-to-r from-purple-500 to-pink-500">
<p className="text-red-600">Error message</p>
```

### Platform Gradients (Text Only)

Platform colors are **ONLY** allowed for text gradients on brand marks:

```tsx
// ✅ CORRECT - Text gradients only
<h1 className="gvteway-text-gradient">GVTEWAY</h1>
<h1 className="atlvs-text-gradient">ATLVS</h1>
<h1 className="compvss-text-gradient">COMPVSS</h1>

// ❌ WRONG - No colored backgrounds
<div className="bg-gvteway-red">
<button className="bg-atlvs-green">
```

---

## ✍️ Typography System

### Font Families

```typescript
// ANTON - Display & H1 (Maximum impact headlines)
font-anton

// BEBAS NEUE - H2 through H6 (Section headers, navigation)
font-bebas

// SHARE TECH - Body Copy (All body text, paragraphs)
font-share

// SHARE TECH MONO - Metadata & Labels (Dates, tags, captions)
font-share-mono
```

### Typography Components (MANDATORY)

**NEVER use raw HTML heading or paragraph tags with className.**  
**ALWAYS use Typography components:**

```tsx
import {
  HeroTitle,        // Anton - Hero headlines
  DisplayTitle,     // Anton - Large display text
  SectionHeader,    // Bebas Neue - H2 section headers
  SubsectionHeader, // Bebas Neue - H3 subsection headers
  CardTitle,        // Bebas Neue - H4 card titles
  BodyText,         // Share Tech - Body paragraphs
  BodyTextLarge,    // Share Tech - Large body text
  BodyTextSmall,    // Share Tech - Small body text
  MetaText,         // Share Tech Mono - Metadata
  CaptionText,      // Share Tech Mono - Captions
} from '@/components/atoms/Typography';

// ✅ CORRECT
<HeroTitle>GHXSTSHIP</HeroTitle>
<SectionHeader>Immersive Entertainment</SectionHeader>
<BodyText>We create impossible experiences...</BodyText>
<MetaText>Tampa, FL // Est. 2022 // 52+ Countries</MetaText>

// ❌ WRONG
<h1 className="font-anton text-hero uppercase">GHXSTSHIP</h1>
<h2 className="font-bebas text-h2">Immersive Entertainment</h2>
<p className="font-share-tech text-body">We create...</p>
```

### Typography Scale

All typography uses responsive `clamp()` for fluid scaling:

```css
/* ANTON - Hero & Display */
--font-size-hero: clamp(3rem, 10vw, 7.5rem);      /* 48px → 120px */
--font-size-display: clamp(2.25rem, 8vw, 5rem);   /* 36px → 80px */

/* BEBAS NEUE - Headers */
--font-size-h1: clamp(2.25rem, 8vw, 5rem);        /* 36px → 80px */
--font-size-h2: clamp(1.75rem, 5vw, 3.5rem);      /* 28px → 56px */
--font-size-h3: clamp(1.5rem, 4vw, 2.5rem);       /* 24px → 40px */
--font-size-h4: clamp(1.25rem, 3vw, 2rem);        /* 20px → 32px */
--font-size-h5: clamp(1.125rem, 2.5vw, 1.5rem);   /* 18px → 24px */
--font-size-h6: clamp(1rem, 2vw, 1.25rem);        /* 16px → 20px */

/* SHARE TECH - Body */
--font-size-body-lg: clamp(1.0625rem, 2vw, 1.25rem);   /* 17px → 20px */
--font-size-body: clamp(0.9375rem, 1.5vw, 1.125rem);   /* 15px → 18px */
--font-size-body-sm: clamp(0.875rem, 1.3vw, 1rem);     /* 14px → 16px */

/* SHARE TECH MONO - Metadata */
--font-size-meta: clamp(0.75rem, 1.2vw, 0.875rem);     /* 12px → 14px */
```

---

## 🔲 Component System

### Atomic Design Structure

```
src/components/
├── atoms/          # Basic building blocks
│   ├── Typography  # All typography components
│   ├── Button      # Button with variants
│   ├── Card        # Card with variants
│   ├── Input       # Form inputs
│   ├── Badge       # Status badges
│   └── ...
├── molecules/      # Combinations of atoms
│   ├── FormField   # Label + Input + Error
│   ├── SearchBar   # Input + Button
│   └── ...
├── organisms/      # Complex components
│   ├── Navbar      # Navigation bar
│   ├── Sidebar     # Side navigation
│   └── ...
└── templates/      # Page layouts
    ├── DashboardLayout
    ├── AtlvsLayout
    └── ...
```

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/atoms/Card';

// ✅ CORRECT - Use Card with variant
<Card variant="atlvs">
  <CardHeader>
    <CardTitle>Event Title</CardTitle>
    <CardDescription>Event description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>

// ❌ WRONG - Custom styling
<div className="bg-gray-900/50 border-gray-800 rounded-lg p-6">
  <h3 className="text-xl font-bebas">Event Title</h3>
  <p className="text-sm text-gray-400">Description</p>
</div>
```

### Button Component

```tsx
import { Button } from '@/components/atoms/Button';

// ✅ CORRECT - Use Button with variant
<Button variant="atlvs">Click Me</Button>
<Button variant="compvss" size="lg">Large Button</Button>
<Button variant="gvteway" outline>Outlined</Button>

// ❌ WRONG - Custom button styling
<button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
  Click Me
</button>
```

---

## 🎬 Geometric Elements & Patterns

### Background Patterns

```tsx
// Halftone pattern (Pop Art aesthetic)
<div className="bg-halftone">Content</div>

// Ben-Day dots
<div className="bg-dots">Content</div>

// Diagonal stripes
<div className="bg-diagonal-stripes">Content</div>

// Grid overlay
<div className="bg-grid">Content</div>
```

### Hard Geometric Shadows

```tsx
// ✅ CORRECT - Hard shadows only
<div className="shadow-hard">Black shadow</div>
<div className="shadow-hard-inverse">White shadow</div>
<div className="shadow-hard-grey">Grey shadow</div>

// ❌ WRONG - Soft shadows
<div className="shadow-lg">Soft shadow</div>
<div className="shadow-xl">Extra soft shadow</div>
```

### Image Treatment

All images must be converted to high-contrast black and white:

```tsx
// ✅ CORRECT - B&W filter applied
<img src="/photo.jpg" className="img-bw" alt="..." />
<img src="/photo.jpg" className="img-pop-art" alt="..." />

// ❌ WRONG - Color images
<img src="/photo.jpg" alt="..." />
```

---

## 📐 Spacing System

Based on 8px grid:

```typescript
spacing: {
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  24: '6rem',    // 96px
}
```

---

## 🚨 Enforcement

### Automated Checking

Run the design system enforcement script:

```bash
npm run enforce-design-system
```

This will scan all files and report violations with zero tolerance.

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
npm run enforce-design-system || exit 1
```

### CI/CD Integration

Add to `.github/workflows/ci-cd.yml`:

```yaml
- name: Enforce Design System
  run: npm run enforce-design-system
```

---

## 📚 Quick Reference

### Do's ✅

- Use ONLY black, white, and greyscale
- Use Typography components for all text
- Use Card, Button, Input components with variants
- Use hard geometric shadows (shadow-hard)
- Convert all images to B&W
- Use uppercase for ANTON and BEBAS NEUE headings
- Use clamp() for responsive sizing
- Respect 8px spacing grid

### Don'ts ❌

- Never use colors beyond monochromatic palette
- Never use raw `<h1>`, `<h2>`, `<p>` with className
- Never create custom component styling
- Never use soft shadows (shadow-lg, shadow-xl)
- Never use color gradients except for text
- Never use decorative or script fonts
- Never use organic curves or soft shapes

---

## 🔧 Migration Guide

### Step 1: Replace Typography

```bash
# Find all raw typography usage
grep -r "className.*text-" src/

# Replace with Typography components
# Before: <h1 className="font-anton text-hero">Title</h1>
# After:  <HeroTitle>Title</HeroTitle>
```

### Step 2: Replace Cards

```bash
# Find custom card styling
grep -r "bg-gray-900/50" src/

# Replace with Card component
# Before: <div className="bg-gray-900/50 border-gray-800">
# After:  <Card variant="atlvs">
```

### Step 3: Replace Buttons

```bash
# Find custom buttons
grep -r "<button className" src/

# Replace with Button component
# Before: <button className="bg-black text-white">
# After:  <Button variant="default">
```

### Step 4: Fix Colors

```bash
# Find color violations
grep -r "bg-\(red\|blue\|green\|yellow\|purple\)" src/

# Replace with monochromatic equivalents
# Before: bg-blue-500
# After:  bg-black or bg-grey-700
```

---

## 📞 Support

For questions or clarifications:

1. Read `/docs/architecture/ATOMIC_DESIGN_SYSTEM.md`
2. Check component examples in `/src/components/atoms/`
3. Run `npm run enforce-design-system` to identify violations
4. Review this document for proper usage patterns

---

**Remember:** GHXSTSHIP doesn't follow trends. GHXSTSHIP creates them.  
**Be bold. Be geometric. Be black and white. Be impossible to ignore.**
