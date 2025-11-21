# 🎨 GHXSTSHIP Design System

**Contemporary Minimal Pop Art Aesthetic**  
**Zero Tolerance Enforcement**

---

## 🚀 Quick Start

### Installation Complete ✅

The GHXSTSHIP design system has been fully implemented across the repository:

- ✅ Tailwind config updated with monochromatic color palette
- ✅ Typography system with responsive clamp() scaling
- ✅ Geometric patterns and utilities
- ✅ Hard shadow system
- ✅ Enforcement scripts and tooling
- ✅ Comprehensive documentation

### Run Enforcement Check

```bash
npm run design:enforce
```

This will scan all files and report violations with zero tolerance.

---

## 📚 Documentation

### Core Documents

1. **[Design System Reference](/Design%20System%20Reference)** - Complete visual identity guide
2. **[GHXSTSHIP_DESIGN_SYSTEM.md](/docs/GHXSTSHIP_DESIGN_SYSTEM.md)** - Implementation guide
3. **[ATOMIC_DESIGN_SYSTEM.md](/docs/architecture/ATOMIC_DESIGN_SYSTEM.md)** - Component library

### Key Principles

1. **Monochromatic Only**: Black, white, and greyscale (grey-100 through grey-900)
2. **Typography Components**: Always use HeroTitle, SectionHeader, BodyText, etc.
3. **Atomic Components**: Use Card, Button, Input with proper variants
4. **Hard Shadows**: Only geometric shadows (shadow-hard, shadow-hard-inverse)
5. **No Color Gradients**: Except for text on platform brand marks

---

## 🎨 Color System

### Monochromatic Palette

```css
/* Primary Colors */
black: #000000
white: #FFFFFF

/* Greyscale Spectrum */
grey-100: #F5F5F5  /* Lightest - subtle backgrounds */
grey-200: #E5E5E5  /* Light - borders, dividers */
grey-300: #D4D4D4  /* Mid-light - secondary borders */
grey-400: #A3A3A3  /* Medium - secondary text */
grey-500: #737373  /* Mid - tertiary text */
grey-600: #525252  /* Mid-dark - metadata text */
grey-700: #404040  /* Dark - subtle backgrounds */
grey-800: #262626  /* Darker - near-black backgrounds */
grey-900: #171717  /* Almost black - deep backgrounds */
```

### Platform Gradients (Text Only)

```tsx
// ✅ CORRECT - Text gradients only
<h1 className="gvteway-text-gradient">GVTEWAY</h1>
<h1 className="atlvs-text-gradient">ATLVS</h1>
<h1 className="compvss-text-gradient">COMPVSS</h1>

// ❌ WRONG - No colored backgrounds
<div className="bg-blue-500">
```

---

## ✍️ Typography System

### Font Families

- **ANTON**: Display & H1 (Maximum impact headlines)
- **BEBAS NEUE**: H2-H6 (Section headers, navigation)
- **SHARE TECH**: Body copy (Paragraphs, descriptions)
- **SHARE TECH MONO**: Metadata (Dates, tags, captions)

### Typography Components (MANDATORY)

```tsx
import {
  HeroTitle,        // Anton - Hero headlines
  SectionHeader,    // Bebas Neue - H2 section headers
  SubsectionHeader, // Bebas Neue - H3 subsection headers
  CardTitle,        // Bebas Neue - H4 card titles
  BodyText,         // Share Tech - Body paragraphs
  BodyTextSmall,    // Share Tech - Small body text
  MetaText,         // Share Tech Mono - Metadata
} from '@/components/atoms/Typography';

// ✅ CORRECT
<HeroTitle>GHXSTSHIP</HeroTitle>
<SectionHeader>Immersive Entertainment</SectionHeader>
<BodyText>We create impossible experiences...</BodyText>

// ❌ WRONG
<h1 className="font-anton text-hero">GHXSTSHIP</h1>
<h2 className="font-bebas text-h2">Section</h2>
<p className="text-body">Text</p>
```

---

## 🔲 Component System

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';

// ✅ CORRECT
<Card variant="atlvs">
  <CardHeader>
    <CardTitle>Event Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ WRONG
<div className="bg-gray-900/50 border-gray-800 rounded-lg">
```

### Button Component

```tsx
import { Button } from '@/components/atoms/Button';

// ✅ CORRECT
<Button variant="atlvs">Click Me</Button>
<Button variant="compvss" size="lg">Large</Button>

// ❌ WRONG
<button className="bg-black text-white px-4 py-2">
```

---

## 🎬 Geometric Elements

### Background Patterns

```tsx
<div className="bg-halftone">Halftone pattern</div>
<div className="bg-dots">Ben-Day dots</div>
<div className="bg-diagonal-stripes">Stripes</div>
<div className="bg-grid">Grid overlay</div>
```

### Hard Shadows

```tsx
// ✅ CORRECT
<div className="shadow-hard">Black shadow</div>
<div className="shadow-hard-inverse">White shadow</div>

// ❌ WRONG
<div className="shadow-lg">Soft shadow</div>
```

### Image Treatment

```tsx
// ✅ CORRECT - B&W filter
<img src="/photo.jpg" className="img-bw" />
<img src="/photo.jpg" className="img-pop-art" />

// ❌ WRONG - Color images
<img src="/photo.jpg" />
```

---

## 🚨 Enforcement

### Automated Checking

```bash
# Run design system enforcement
npm run design:enforce

# Same as above (aliases)
npm run design:check
npm run design:validate
```

### What Gets Checked

1. **Color Violations**: Any color beyond black, white, greyscale
2. **Typography Violations**: Raw HTML elements with className
3. **Component Violations**: Custom styling instead of atomic components
4. **Shadow Violations**: Soft shadows instead of hard geometric
5. **Font Violations**: Raw font classes instead of Typography components
6. **Gradient Violations**: Gradients used outside text context

### Exit Codes

- `0`: No violations (success)
- `1`: Violations found (failure)

### CI/CD Integration

Add to `.github/workflows/ci-cd.yml`:

```yaml
- name: Enforce GHXSTSHIP Design System
  run: npm run design:enforce
```

---

## 🔧 Migration Guide

### Step 1: Replace Typography

```bash
# Find violations
npm run design:enforce

# Fix manually or use atomic:fix scripts
npm run atomic:fix:typography
```

**Before:**
```tsx
<h1 className="font-anton text-hero uppercase">Title</h1>
<h2 className="font-bebas text-h2">Section</h2>
<p className="font-share-tech text-body">Body text</p>
```

**After:**
```tsx
<HeroTitle>Title</HeroTitle>
<SectionHeader>Section</SectionHeader>
<BodyText>Body text</BodyText>
```

### Step 2: Replace Cards

**Before:**
```tsx
<div className="bg-gray-900/50 border-gray-800 rounded-lg p-6">
  <h3 className="text-xl font-bebas">Title</h3>
  <p className="text-sm text-gray-400">Description</p>
</div>
```

**After:**
```tsx
<Card variant="atlvs">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
</Card>
```

### Step 3: Replace Buttons

**Before:**
```tsx
<button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
  Click Me
</button>
```

**After:**
```tsx
<Button variant="default">Click Me</Button>
```

### Step 4: Fix Colors

**Before:**
```tsx
<div className="bg-blue-500 text-white">
<p className="text-red-600">Error</p>
<div className="border-green-500">
```

**After:**
```tsx
<div className="bg-black text-white">
<p className="text-grey-900">Error</p>
<div className="border-grey-300">
```

---

## 📐 Design Tokens

### Spacing (8px grid)

```typescript
1: 4px    2: 8px    3: 12px   4: 16px
6: 24px   8: 32px   12: 48px  16: 64px
```

### Border Widths

```typescript
1: 1px   // Subtle border
2: 2px   // Standard border (default)
3: 3px   // Thick border (emphasis)
```

### Typography Scale (Responsive with clamp)

```css
hero:    48px → 120px
display: 36px → 80px
h1:      36px → 80px
h2:      28px → 56px
h3:      24px → 40px
h4:      20px → 32px
h5:      18px → 24px
h6:      16px → 20px
body:    15px → 18px
meta:    12px → 14px
```

---

## ✅ Checklist for New Components

Before creating any new component:

- [ ] Check if component exists in `/src/components/atoms/`
- [ ] Use only black, white, and greyscale colors
- [ ] Use Typography components for all text
- [ ] Use Card/Button/Input with proper variants
- [ ] Apply hard geometric shadows only
- [ ] Convert all images to B&W
- [ ] Use uppercase for ANTON and BEBAS NEUE
- [ ] Follow 8px spacing grid
- [ ] Run `npm run design:enforce` to verify

---

## 🎯 Zero Tolerance Rules

### NEVER

❌ Use colors beyond monochromatic palette  
❌ Use raw `<h1>`, `<h2>`, `<p>` with className  
❌ Create custom component styling  
❌ Use soft shadows (shadow-lg, shadow-xl)  
❌ Use color gradients except for text  
❌ Use decorative or script fonts  
❌ Use organic curves or soft shapes  

### ALWAYS

✅ Use ONLY black, white, and greyscale  
✅ Use Typography components for all text  
✅ Use Card, Button, Input with variants  
✅ Use hard geometric shadows  
✅ Convert all images to B&W  
✅ Use uppercase for headers  
✅ Follow 8px spacing grid  
✅ Run enforcement before committing  

---

## 📞 Support & Resources

### Documentation

- `/Design System Reference` - Complete visual guide
- `/docs/GHXSTSHIP_DESIGN_SYSTEM.md` - Implementation guide
- `/docs/architecture/ATOMIC_DESIGN_SYSTEM.md` - Component library

### Scripts

- `npm run design:enforce` - Check for violations
- `npm run atomic:fix:typography` - Fix typography violations
- `npm run atomic:validate` - Validate atomic design

### Component Examples

- `/src/components/atoms/Typography` - Typography components
- `/src/components/atoms/Card` - Card component
- `/src/components/atoms/Button` - Button component

---

## 🎨 Philosophy

**GHXSTSHIP doesn't follow trends. GHXSTSHIP creates them.**

- **Bold**: Maximum impact, never timid
- **Geometric**: Hard edges, perfect shapes
- **Monochromatic**: Black, white, greyscale only
- **Pop Art**: Halftone, dots, screen print aesthetic
- **Brutalist**: Raw, honest, purposeful design

**Be bold. Be geometric. Be black and white. Be impossible to ignore.**

---

## 📊 Current Status

- ✅ Design system fully implemented
- ✅ Tailwind config updated
- ✅ Typography system with clamp()
- ✅ Geometric patterns and utilities
- ✅ Enforcement scripts created
- ✅ Documentation complete
- 🔄 Migration in progress (~1,463 violations remaining)

Run `npm run design:enforce` to see current violation count.

---

**Last Updated**: November 2025  
**Version**: 1.0  
**Status**: Active Enforcement
