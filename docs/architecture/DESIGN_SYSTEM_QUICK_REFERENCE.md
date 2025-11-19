# Design System Quick Reference

## 🚀 Import Everything from One Place

```typescript
import { 
  tokens, Button, Input, Card, Typography,
  FormField, Navbar, DashboardLayout,
  useTheme, useBreakpoint, cn 
} from '@/design-system';
```

## 🎨 Design Tokens

### Colors
```typescript
tokens.colors.black           // #000000
tokens.colors.white           // #FFFFFF
tokens.colors.grey[100-900]   // Greyscale spectrum
```

### Typography
```typescript
tokens.typography.fontFamily.anton      // Display & H1
tokens.typography.fontFamily.bebas      // H2-H6
tokens.typography.fontFamily.share      // Body text
tokens.typography.fontFamily.shareMono  // Metadata
```

### Spacing
```typescript
tokens.spacing[0]   // 0
tokens.spacing[1]   // 0.25rem (4px)
tokens.spacing[4]   // 1rem (16px)
tokens.spacing[8]   // 2rem (32px)
```

## 🧩 Components

### Typography (ALWAYS use these)
```typescript
<HeroTitle>Hero Statement</HeroTitle>
<DisplayTitle>Display Title</DisplayTitle>
<PageTitle>Page Title</PageTitle>
<SectionHeader>Section Header</SectionHeader>
<SubsectionHeader>Subsection</SubsectionHeader>
<BodyText>Body content</BodyText>
<BodyTextSmall>Small text</BodyTextSmall>
<Metadata>12 Jan 2025</Metadata>
<Caption>Caption text</Caption>
```

### Button
```typescript
<Button variant="atlvs|compvss|gvteway|default" size="sm|md|lg">
  Click Me
</Button>
```

### Card
```typescript
<Card variant="atlvs|compvss|gvteway|default">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Input
```typescript
<Input 
  type="text|email|password|number"
  placeholder="Enter text"
  error="Error message"
  disabled={false}
/>
```

### FormField
```typescript
<FormField label="Label" error="Error" required>
  <Input type="email" />
</FormField>
```

## 🎭 Platform Variants

- **`atlvs`** - Green/Orange/Purple gradient
- **`compvss`** - Cyan/Teal/Indigo gradient
- **`gvteway`** - Red/Yellow/Blue gradient
- **`default`** - Monochromatic black/white

## 🪝 Hooks

### useTheme
```typescript
const { theme, setTheme, mounted } = useTheme();
setTheme('light' | 'dark' | 'high-contrast');
```

### useBreakpoint
```typescript
const { current, isSmall, isMedium, isLarge } = useBreakpoint();
```

### useDesignTokens
```typescript
const { tokens, colors, typography } = useDesignTokens();
```

## 🛠️ Utilities

### cn (Class Name Utility)
```typescript
const className = cn(
  'base-class',
  condition && 'conditional-class',
  'override-class'
);
```

### createVariants
```typescript
const styles = createVariants('base', {
  variant: { primary: 'bg-black', secondary: 'bg-white' },
  size: { sm: 'text-sm', lg: 'text-lg' }
});

const classes = styles({ variant: 'primary', size: 'lg' });
```

## ⚠️ Critical Rules

### ❌ NEVER
```typescript
// Never use raw font classes
<h1 className="font-anton text-h1">Title</h1>

// Never use raw color classes
<div className="bg-gray-900/50 border-gray-800">...</div>

// Never create custom button styling
<button className="bg-black text-white px-4 py-2">Click</button>
```

### ✅ ALWAYS
```typescript
// Always use Typography components
<HeroTitle>Title</HeroTitle>

// Always use Card components
<Card variant="atlvs">...</Card>

// Always use Button components
<Button variant="default">Click</Button>
```

## 📁 File Structure

```
src/design-system/
├── index.ts              # Single import point
├── tokens/               # Design tokens
│   ├── primitives/      # colors, typography, spacing
│   └── themes/          # light, dark, high-contrast
├── hooks/                # useTheme, useBreakpoint, etc.
├── utils/                # cn, createVariants, etc.
└── README.md             # Full documentation
```

## 📚 Documentation

- **Full Guide:** `/src/design-system/README.md`
- **Consolidation Plan:** `/DESIGN_SYSTEM_CONSOLIDATION_PLAN.md`
- **Summary:** `/DESIGN_SYSTEM_CONSOLIDATION_SUMMARY.md`
- **Atomic Design:** `/docs/architecture/ATOMIC_DESIGN_SYSTEM.md`

---

**Quick Tip:** When in doubt, import from `@/design-system` and use the component, not raw Tailwind classes!
