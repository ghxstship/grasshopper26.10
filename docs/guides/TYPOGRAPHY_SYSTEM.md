# Typography System Documentation

## Overview

The GHXSTSHIP typography system provides a comprehensive, semantic approach to typography across all applications (GVTEWAY, ATLVS, COMPVSS). All typography values are centralized using CSS custom properties and Tailwind utility classes.

## Design Principles

1. **Semantic Naming**: Typography tokens use semantic names (e.g., `text-h1`, `text-body`) instead of arbitrary sizes
2. **Single Source of Truth**: All typography values defined in `globals.css` CSS variables
3. **Responsive by Default**: Typography automatically scales across breakpoints via CSS variables
4. **Zero Hardcoding**: No hardcoded font sizes, weights, line heights, or letter spacing in components
5. **Consistent Hierarchy**: Clear visual hierarchy through predefined typography scales

## Typography Scale

### Display Typography

| Token | Font Family | Size (Desktop) | Size (Mobile) | Use Case |
|-------|-------------|----------------|---------------|----------|
| `text-hero` | Anton | 96px (6rem) | 48px (3rem) | Largest hero text, landing pages |
| `text-display` | Anton | 72px (4.5rem) | 40px (2.5rem) | Large display text, section heroes |

### Heading Typography

| Token | Font Family | Size (Desktop) | Size (Mobile) | Use Case |
|-------|-------------|----------------|---------------|----------|
| `text-h1` | Bebas Neue | 60px (3.75rem) | 36px (2.25rem) | Page titles |
| `text-h2` | Bebas Neue | 48px (3rem) | 32px (2rem) | Section headers |
| `text-h3` | Bebas Neue | 36px (2.25rem) | 28px (1.75rem) | Subsection headers |
| `text-h4` | Bebas Neue | 30px (1.875rem) | 24px (1.5rem) | Card titles, smaller headers |
| `text-h5` | Bebas Neue | 24px (1.5rem) | 20px (1.25rem) | Small headers |
| `text-h6` | Bebas Neue | 20px (1.25rem) | 18px (1.125rem) | Smallest headers |

### Body Typography

| Token | Font Family | Size | Use Case |
|-------|-------------|------|----------|
| `text-subtitle` | Oswald | 18px (1.125rem) | Subtitles, lead paragraphs |
| `text-body-lg` | Share Tech | 18px (1.125rem) | Large body text |
| `text-body` | Share Tech | 16px (1rem) | Default body text |
| `text-body-sm` | Share Tech | 14px (0.875rem) | Small body text, labels |
| `text-caption` | Share Tech Mono | 12px (0.75rem) | Captions, metadata |
| `text-overline` | Share Tech Mono | 10px (0.625rem) | Overlines, tags |

## Usage

### In Components

```tsx
// ✅ CORRECT - Using semantic typography tokens
<h1 className="font-anton text-hero">Hero Title</h1>
<h2 className="font-bebas text-h1">Page Title</h2>
<p className="font-share-tech text-body">Body text</p>

// ❌ INCORRECT - Hardcoded typography values
<h1 className="text-6xl font-bold leading-tight">Hero Title</h1>
<h2 className="text-4xl font-semibold">Page Title</h2>
<p className="text-base leading-relaxed">Body text</p>
```

### Using Typography Components

Pre-built typography components are available in `src/components/atoms/Typography.tsx`:

```tsx
import { 
  HeroTitle, 
  DisplayTitle,
  PageTitle, 
  SectionHeader,
  SubsectionHeader,
  CardTitle,
  SmallHeader,
  Subtitle,
  BodyText,
  BodyTextLarge,
  BodyTextSmall,
  Caption,
  Overline
} from '@/components/atoms/Typography';

// Usage
<HeroTitle>Welcome to GVTEWAY</HeroTitle>
<PageTitle>Discover Events</PageTitle>
<BodyText>Find amazing experiences near you.</BodyText>
```

### Using Text Component with Variants

```tsx
import { Text } from '@/components/atoms/Text';

<Text variant="h1">Page Title</Text>
<Text variant="body">Body content</Text>
<Text variant="caption">Small caption</Text>
```

## CSS Variables Reference

All typography values are defined as CSS custom properties in `src/app/globals.css`:

```css
/* Hero Typography */
--font-size-hero: 6rem;
--line-height-hero: 1;
--letter-spacing-hero: 0.05em;
--font-weight-hero: 400;

/* H1 Typography */
--font-size-h1: 3.75rem;
--line-height-h1: 1.1;
--letter-spacing-h1: 0.02em;
--font-weight-h1: 400;

/* Body Typography */
--font-size-body: 1rem;
--line-height-body: 1.6;
--letter-spacing-body: 0.01em;
--font-weight-body: 400;
```

## Responsive Behavior

Typography automatically scales across breakpoints:

- **Mobile (≤640px)**: Reduced font sizes for optimal mobile readability
- **Tablet (641px-1024px)**: Intermediate sizes for tablet devices
- **Desktop (>1024px)**: Full-size typography

No responsive classes needed - handled automatically via CSS variables.

## Font Families

| Font | Variable | Use Case |
|------|----------|----------|
| Anton | `font-anton` | Hero and display text |
| Bebas Neue | `font-bebas` | Headings (H1-H6) |
| Oswald | `font-oswald` | Subtitles |
| Share Tech | `font-share-tech` | Body text |
| Share Tech Mono | `font-share-tech-mono` | Captions, metadata, code |

## Brand Text Gradients

Special gradient classes for brand-specific hero text:

```tsx
<h1 className="gvteway-text-gradient">GVTEWAY</h1>
<h1 className="atlvs-text-gradient">ATLVS</h1>
<h1 className="compvss-text-gradient">COMPVSS</h1>
```

These automatically use the `text-hero` typography scale.

## Migration Guide

### Automated Migration

A remediation script is available to automatically convert hardcoded typography:

```bash
node scripts/remediate-typography.mjs
```

This script:
- Converts hardcoded font sizes to semantic tokens
- Removes redundant font-weight, line-height, and letter-spacing classes
- Removes responsive typography classes (handled by CSS variables)
- Cleans up className formatting

### Manual Migration

For custom cases, follow this mapping:

| Old Class | New Class |
|-----------|-----------|
| `text-9xl` | `text-hero` |
| `text-7xl` | `text-display` |
| `text-6xl` / `text-5xl` | `text-h1` |
| `text-4xl` | `text-h2` |
| `text-3xl` | `text-h3` |
| `text-2xl` | `text-h4` |
| `text-xl` | `text-h5` |
| `text-lg` | `text-h6` |
| `text-base` | `text-body` |
| `text-sm` | `text-body-sm` |
| `text-xs` | `text-caption` |

Remove these classes (handled by semantic tokens):
- `font-bold`, `font-semibold`, `font-medium`, etc.
- `leading-tight`, `leading-relaxed`, `leading-none`, etc.
- `tracking-wide`, `tracking-tight`, `tracking-wider`, etc.
- `md:text-*`, `lg:text-*` (responsive variants)

## Best Practices

1. **Always use semantic tokens** - Never hardcode font sizes
2. **Let CSS variables handle responsiveness** - Don't use responsive classes for typography
3. **Use pre-built components** - Leverage `Typography.tsx` components for consistency
4. **Don't override typography properties** - If you need different typography, use a different semantic token
5. **Maintain hierarchy** - Use appropriate heading levels for accessibility

## Accessibility

- Semantic HTML elements (`<h1>`, `<h2>`, etc.) are used for proper document structure
- Font sizes meet WCAG 2.1 minimum requirements
- Line heights provide adequate spacing for readability
- Letter spacing optimized for each font family

## Testing

After making typography changes:

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build the project
npm run build

# Run tests
npm test
```

## Troubleshooting

### Issue: Typography looks different after migration

**Solution**: Clear your browser cache and rebuild the project. CSS variables may be cached.

### Issue: Responsive typography not working

**Solution**: Ensure you're not using responsive classes like `md:text-*`. The system handles responsiveness automatically via CSS variables.

### Issue: Custom font sizes needed

**Solution**: Don't add custom sizes. Use the closest semantic token or discuss adding a new token to the design system.

## Support

For questions or issues with the typography system:
1. Check this documentation
2. Review `src/app/globals.css` for CSS variable definitions
3. Review `tailwind.config.ts` for Tailwind configuration
4. Consult the design team for new typography requirements

---

**Last Updated**: November 18, 2025  
**Version**: 1.0.0  
**Maintained by**: GHXSTSHIP Design System Team
