# Typography Quick Start Guide

## TL;DR

**Use semantic tokens, not hardcoded sizes.**

```tsx
// ✅ DO THIS
<h1 className="font-anton text-hero">Title</h1>
<p className="font-share-tech text-body">Text</p>

// ❌ NOT THIS
<h1 className="text-6xl font-bold">Title</h1>
<p className="text-base leading-relaxed">Text</p>
```

---

## Typography Tokens

| What You Need | Use This Token | Example |
|---------------|----------------|---------|
| Huge hero text | `text-hero` | `<h1 className="font-anton text-hero">` |
| Large display | `text-display` | `<h1 className="font-anton text-display">` |
| Page title | `text-h1` | `<h2 className="font-bebas text-h1">` |
| Section header | `text-h2` | `<h3 className="font-bebas text-h2">` |
| Subsection | `text-h3` | `<h4 className="font-bebas text-h3">` |
| Card title | `text-h4` | `<h5 className="font-bebas text-h4">` |
| Small header | `text-h5` | `<h6 className="font-bebas text-h5">` |
| Tiny header | `text-h6` | `<h6 className="font-bebas text-h6">` |
| Subtitle | `text-subtitle` | `<p className="font-oswald text-subtitle">` |
| Large body | `text-body-lg` | `<p className="font-share-tech text-body-lg">` |
| Normal body | `text-body` | `<p className="font-share-tech text-body">` |
| Small body | `text-body-sm` | `<p className="font-share-tech text-body-sm">` |
| Caption | `text-caption` | `<span className="font-share-tech-mono text-caption">` |
| Overline/Tag | `text-overline` | `<span className="font-share-tech-mono text-overline">` |

---

## Pre-built Components

Even easier - use these:

```tsx
import { 
  HeroTitle,      // Huge hero text
  DisplayTitle,   // Large display
  PageTitle,      // Page title
  SectionHeader,  // Section header
  CardTitle,      // Card title
  BodyText,       // Normal body
  Caption         // Small caption
} from '@/components/atoms/Typography';

// Usage
<HeroTitle>GVTEWAY</HeroTitle>
<PageTitle>Events</PageTitle>
<BodyText>Find events near you</BodyText>
```

---

## Font Families

| Font | Class | When to Use |
|------|-------|-------------|
| Anton | `font-anton` | Hero/display text only |
| Bebas Neue | `font-bebas` | All headings (H1-H6) |
| Oswald | `font-oswald` | Subtitles |
| Share Tech | `font-share-tech` | Body text (default) |
| Share Tech Mono | `font-share-tech-mono` | Captions, metadata, code |

---

## Rules

### ✅ DO
- Use semantic tokens (`text-hero`, `text-h1`, `text-body`)
- Let tokens handle font-weight, line-height, letter-spacing
- Let tokens handle responsive sizing
- Use pre-built Typography components

### ❌ DON'T
- Use hardcoded sizes (`text-6xl`, `text-base`, `text-sm`)
- Add `font-bold`, `font-semibold`, `font-medium`
- Add `leading-tight`, `leading-relaxed`
- Add `tracking-wide`, `tracking-tight`
- Add responsive classes (`md:text-*`, `lg:text-*`)

---

## Common Patterns

### Hero Section
```tsx
<section>
  <h1 className="font-anton text-hero">GVTEWAY</h1>
  <p className="font-oswald text-subtitle">Discover Amazing Events</p>
</section>
```

### Page Header
```tsx
<header>
  <h1 className="font-bebas text-h1">Event Details</h1>
  <p className="font-share-tech text-body">Find all the information you need</p>
</header>
```

### Card
```tsx
<div className="card">
  <h3 className="font-bebas text-h4">Card Title</h3>
  <p className="font-share-tech text-body-sm">Card description</p>
  <span className="font-share-tech-mono text-caption">Updated 5m ago</span>
</div>
```

### Form Label
```tsx
<label className="font-share-tech text-body-sm">
  Email Address
</label>
```

---

## Responsive Behavior

**You don't need to do anything!** Typography automatically scales:

```tsx
// This is responsive by default
<h1 className="font-anton text-hero">Title</h1>

// Desktop: 96px
// Tablet: 72px  
// Mobile: 48px
```

---

## Brand Gradients

Special classes for brand hero text:

```tsx
<h1 className="gvteway-text-gradient">GVTEWAY</h1>
<h1 className="atlvs-text-gradient">ATLVS</h1>
<h1 className="compvss-text-gradient">COMPVSS</h1>
```

---

## Need Help?

1. **Full docs**: `docs/guides/TYPOGRAPHY_SYSTEM.md`
2. **Examples**: `src/components/atoms/Typography.tsx`
3. **CSS vars**: `src/app/globals.css` (lines 39-128)

---

## Migration

Old code? Run this:

```bash
node scripts/remediate-typography.mjs
```

It will automatically convert hardcoded values to semantic tokens.

---

**Remember**: Semantic tokens = happy code! 🎉
