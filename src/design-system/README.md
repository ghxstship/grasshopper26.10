# GHXSTSHIP Design System

**Contemporary Minimal Pop Art Aesthetic**  
Monochromatic • Geometric • Bold Typography

## 🎯 Single Source of Truth

This design system is the **single source of truth** for all UI components, design tokens, and styling across the GHXSTSHIP platform (GVTEWAY, COMPVSS, ATLVS).

## 📦 What's Included

```
src/design-system/
├── tokens/          # Design tokens (colors, typography, spacing, etc.)
├── primitives/      # Atomic components (buttons, inputs, cards, etc.)
├── components/      # Composite components (molecules + organisms)
├── templates/       # Page layouts
├── hooks/           # Design system hooks
├── utils/           # Utilities (cn, variants, etc.)
└── types/           # TypeScript types
```

## 🚀 Quick Start

### Import Everything from One Place

```typescript
import { 
  // Design Tokens
  tokens,
  
  // Primitives (Atoms)
  Button,
  Input,
  Card,
  Typography,
  
  // Components
  FormField,
  Navbar,
  
  // Templates
  DashboardLayout,
  
  // Hooks
  useTheme,
  useBreakpoint,
  
  // Utils
  cn,
} from '@/design-system';
```

## 🎨 Design Tokens

### Colors (Monochromatic Only)

```typescript
import { tokens } from '@/design-system';

// Pure base colors
tokens.colors.black    // #000000
tokens.colors.white    // #FFFFFF

// Greyscale spectrum (100-900)
tokens.colors.grey[100]  // #F5F5F5 (lightest)
tokens.colors.grey[900]  // #171717 (darkest)

// Semantic colors
tokens.semanticColors.surface.primary
tokens.semanticColors.text.primary
tokens.semanticColors.border.default
```

### Typography (Four-Font System)

```typescript
// Font families
tokens.typography.fontFamily.anton      // Display & H1
tokens.typography.fontFamily.bebas      // H2-H6
tokens.typography.fontFamily.share      // Body text
tokens.typography.fontFamily.shareMono  // Metadata

// Font sizes (fluid/responsive)
tokens.typography.fontSize.hero    // clamp(3rem, 10vw, 7.5rem)
tokens.typography.fontSize.h1      // clamp(2.25rem, 6vw, 5rem)
tokens.typography.fontSize.body    // clamp(0.9375rem, 1.5vw, 1.125rem)
```

### Spacing

```typescript
tokens.spacing[0]   // 0
tokens.spacing[1]   // 0.25rem (4px)
tokens.spacing[4]   // 1rem (16px)
tokens.spacing[8]   // 2rem (32px)
tokens.spacing[16]  // 4rem (64px)
```

### Borders & Shadows

```typescript
// Border radius (minimal - geometric hard edges)
tokens.borders.radius.none    // 0
tokens.borders.radius.full    // 9999px (circles only)

// Hard geometric shadows (no soft drop shadows)
tokens.shadows.hard           // 8px 8px 0 #000000
tokens.shadows['hard-sm']     // 4px 4px 0 #000000
tokens.shadows['hard-lg']     // 12px 12px 0 #000000
```

## 🧩 Components

### Primitives (Atoms)

Basic building blocks that can't be broken down further:

```typescript
import { Button, Input, Card, Badge, Typography } from '@/design-system';

// Button with platform variant
<Button variant="atlvs" size="lg">
  Click Me
</Button>

// Input with validation
<Input 
  type="email" 
  placeholder="Enter email"
  error="Invalid email"
/>

// Card with platform variant
<Card variant="compvss">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>

// Typography components (ALWAYS use these, never raw font classes)
<HeroTitle>Hero Statement</HeroTitle>
<SectionHeader>Section Title</SectionHeader>
<BodyText>Body content</BodyText>
<Metadata>12 Jan 2025</Metadata>
```

### Components (Molecules & Organisms)

Complex combinations of primitives:

```typescript
import { FormField, SearchBar, Navbar, DataTable } from '@/design-system';

// Form field with label and error
<FormField
  label="Email Address"
  error="Required field"
  required
>
  <Input type="email" />
</FormField>

// Search bar with filters
<SearchBar
  placeholder="Search..."
  onSearch={handleSearch}
  filters={['All', 'Active', 'Archived']}
/>

// Data table with sorting and pagination
<DataTable
  data={items}
  columns={columns}
  onRowClick={handleRowClick}
  searchable
  exportable
/>
```

### Templates

Page-level layouts:

```typescript
import { DashboardLayout, GvtewayLayout } from '@/design-system';

// Dashboard layout with sidebar
<DashboardLayout
  sidebar={<Sidebar sections={sections} />}
  navbar={<Navbar />}
>
  {children}
</DashboardLayout>

// Platform-specific layout
<GvtewayLayout showNav={true}>
  {children}
</GvtewayLayout>
```

## 🎭 Platform Variants

All components support platform-specific variants:

- **`atlvs`** - Green/Orange/Purple gradient
- **`compvss`** - Cyan/Teal/Indigo gradient  
- **`gvteway`** - Red/Yellow/Blue gradient
- **`default`** - Monochromatic black/white

```typescript
<Button variant="atlvs">ATLVS Button</Button>
<Card variant="compvss">COMPVSS Card</Card>
<Badge variant="gvteway">GVTEWAY Badge</Badge>
```

## 🪝 Hooks

### useTheme

Manage theme switching:

```typescript
import { useTheme } from '@/design-system';

const { theme, setTheme, mounted } = useTheme();

// Switch theme
setTheme('dark');  // 'light' | 'dark' | 'high-contrast'
```

### useBreakpoint

Responsive breakpoint detection:

```typescript
import { useBreakpoint } from '@/design-system';

const { current, isSmall, isMedium, isLarge } = useBreakpoint();

if (isSmall) {
  // Mobile layout
}
```

### useDesignTokens

Programmatic access to design tokens:

```typescript
import { useDesignTokens } from '@/design-system';

const { tokens, colors, typography } = useDesignTokens();

const primaryColor = colors.black;
const heroFont = typography.fontFamily.anton;
```

## 🛠️ Utilities

### cn (Class Name Utility)

Merge Tailwind classes with proper precedence:

```typescript
import { cn } from '@/design-system';

const className = cn(
  'base-class',
  condition && 'conditional-class',
  'override-class'
);
```

### createVariants

Create type-safe variant systems:

```typescript
import { createVariants } from '@/design-system';

const buttonStyles = createVariants(
  'base-button-classes',
  {
    variant: {
      primary: 'bg-black text-white',
      secondary: 'bg-white text-black border border-black',
    },
    size: {
      sm: 'px-3 py-1 text-sm',
      lg: 'px-6 py-3 text-lg',
    },
  }
);

// Use it
const classes = buttonStyles({ variant: 'primary', size: 'lg' });
```

## 📏 Design Principles

### 1. Monochromatic Color System
- **ONLY** black, white, and greyscale
- No color except for platform-specific gradients
- High contrast for accessibility

### 2. Bold Typography
- **ANTON** for display and H1 (maximum impact)
- **BEBAS NEUE** for H2-H6 (section headers)
- **SHARE TECH** for body text (readability)
- **SHARE TECH MONO** for metadata (technical info)

### 3. Geometric Hard Edges
- No border radius (except circles)
- Hard geometric shadows, not soft drop shadows
- Sharp, precise, purposeful

### 4. Atomic Design Structure
- **Atoms** → Basic building blocks
- **Molecules** → Simple combinations
- **Organisms** → Complex sections
- **Templates** → Page layouts

## ⚠️ Critical Rules

### ALWAYS Use Typography Components

```typescript
// ❌ NEVER do this
<h1 className="font-anton text-h1">Title</h1>

// ✅ ALWAYS do this
<HeroTitle>Title</HeroTitle>
```

### ALWAYS Use Card Components Properly

```typescript
// ❌ NEVER do this
<div className="bg-gray-900/50 border-gray-800">...</div>

// ✅ ALWAYS do this
<Card variant="atlvs">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### ALWAYS Use Button Variants

```typescript
// ❌ NEVER do this
<button className="bg-black text-white px-4 py-2">Click</button>

// ✅ ALWAYS do this
<Button variant="default" size="md">Click</Button>
```

## 📚 Additional Resources

- [Atomic Design System Documentation](/docs/architecture/ATOMIC_DESIGN_SYSTEM.md)
- [Design System Consolidation Plan](/DESIGN_SYSTEM_CONSOLIDATION_PLAN.md)
- [Tailwind Configuration](/tailwind.config.ts)

## 🤝 Contributing

When adding new components:

1. Check if a similar component exists
2. Use design tokens, never hardcoded values
3. Support all platform variants
4. Include TypeScript types
5. Add to appropriate atomic design level
6. Update this documentation

## 📝 Migration Status

- ✅ Design tokens consolidated
- ✅ Utilities and hooks created
- ✅ Single import point established
- 🔄 Component migration in progress
- ⏳ Full token integration pending

---

**Last Updated:** November 2025  
**Version:** 1.0.0  
**Maintainer:** GHXSTSHIP Design Team
