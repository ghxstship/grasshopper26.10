# Neobrutalist Design Migration Guide

## Overview

This guide explains the changes required to migrate your UI from the previous soft minimal design to the new **neobrutalist/brutalist** aesthetic while preserving existing colors and fonts.

## Design Philosophy Change

### Before (Soft Minimal)
- Rounded corners (`rounded-2xl`, `rounded-lg`)
- Subtle gray borders
- Soft shadows (`shadow-lg`)
- Gradient backgrounds for emphasis

### After (Neobrutalist)
- **Sharp geometric edges** (`rounded-none`)
- **Bold black borders** (`border-3 border-black`)
- **Flat design** (no soft shadows, optional hard offset shadows)
- **Solid color blocks** for backgrounds
- **High contrast** black/white with subtle color blocks

## Key Changes

### 1. Borders
```tsx
// Before
<Card className="rounded-2xl border-2 border-grey-200" />

// After
<Card className="rounded-none border-3 border-black" brutalist />
```

**New Border Tokens:**
- `border-3` - Standard brutalist border (3px)
- `border-black` - Default border color
- `rounded-none` - Default for sharp edges

### 2. Shadows
```tsx
// Before
<Button className="shadow-lg hover:shadow-xl" />

// After
<Button className="shadow-none hover:shadow-hard-base hover:translate-x-[-2px] hover:translate-y-[-2px]" />
```

**New Shadow Tokens:**
- `shadow-none` - Flat design (primary)
- `shadow-hard-base` - Hard offset shadow (4px 4px 0 #000000)
- `shadow-hard-sm` - Minimal depth (2px 2px 0 #000000)
- `shadow-hard-lg` - Elevated (6px 6px 0 #000000)

### 3. Greyscale Backgrounds
```tsx
// Use greyscale for visual hierarchy
<Card className="bg-white" />      // Primary
<Card className="bg-grey-100" />   // Secondary
<Card className="bg-grey-200" />   // Tertiary
```

**Available Greyscale Shades:**
- `grey-100` - #F5F5F5 (Lightest)
- `grey-200` - #E5E5E5
- `grey-300` - #D4D4D4
- `grey-400` - #A3A3A3
- `grey-500` - #737373
- `grey-600` - #525252
- `grey-700` - #404040
- `grey-800` - #262626
- `grey-900` - #171717 (Darkest)

### 4. Component Updates

#### Card Component
```tsx
// New brutalist prop (default: true)
<Card brutalist variant="default">
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Greyscale background
<Card className="bg-grey-100">
  <CardContent>Light grey background</CardContent>
</Card>

// Legacy soft style
<Card brutalist={false}>
  <CardContent>Rounded with soft shadows</CardContent>
</Card>
```

#### Button Component
```tsx
// Brutalist primary (with hard shadow on hover)
<Button variant="primary">
  Click Me
</Button>

// Outline style
<Button variant="outline">
  Secondary
</Button>

// Ghost style
<Button variant="ghost">
  Tertiary
</Button>
```

**Button Features:**
- Sharp edges by default (`rounded="default"` = `rounded-none`)
- Bold borders (`border-3`)
- Hard shadow hover effect with translate
- Active state removes shadow (button press effect)

#### Input & Select Components
```tsx
// Brutalist inputs (default)
<Input brutalist placeholder="Enter text..." />

// Legacy rounded style
<Input brutalist={false} placeholder="Enter text..." />

// Select with sharp edges
<Select brutalist>
  <option>Option 1</option>
  <option>Option 2</option>
</Select>
```

#### Progress Component
```tsx
// Brutalist progress bar (with border)
<Progress value={75} brutalist showBorder />

// Without border
<Progress value={50} brutalist showBorder={false} />

// Legacy rounded style
<Progress value={25} brutalist={false} />
```

#### Badge Component
```tsx
// Brutalist badge (sharp, uppercase)
<Badge variant="default">NEW</Badge>

// With black background
<Badge variant="primary">FEATURED</Badge>

// Outline style
<Badge variant="gvteway-outline">LIVE</Badge>

// Legacy pill style
<Badge rounded="full">Legacy</Badge>
```

### 5. Tailwind Utility Classes

**New utility classes available:**
```css
/* Borders */
.border-3 { border-width: 3px; }

/* Shadows */
.shadow-none { box-shadow: none; }
.shadow-flat { box-shadow: none; }
.shadow-hard-sm { box-shadow: 2px 2px 0 #000000; }
.shadow-hard-base { box-shadow: 4px 4px 0 #000000; }
.shadow-hard-lg { box-shadow: 6px 6px 0 #000000; }
.shadow-hard-xl { box-shadow: 8px 8px 0 #000000; }

/* Greyscale backgrounds */
.bg-grey-100 { background-color: #F5F5F5; }
.bg-grey-200 { background-color: #E5E5E5; }
.bg-grey-300 { background-color: #D4D4D4; }
/* ... through grey-900 */
```

## Migration Strategy

### Automatic (Default)
Most components now default to `brutalist={true}`, so existing code will automatically adopt the new style:

```tsx
// This automatically uses neobrutalist style
<Card>
  <CardContent>Content</CardContent>
</Card>
```

### Gradual Migration
To keep legacy styling while testing:

```tsx
// Explicitly disable brutalist mode
<Card brutalist={false}>
  <CardContent>Old soft style</CardContent>
</Card>
```

### Full Adoption
Remove `brutalist={false}` props once you've verified the new design:

```tsx
// Before
<Input brutalist={false} />

// After (default)
<Input />
```

## Visual Examples

### Dashboard Card Layout
```tsx
<div className="grid grid-cols-3 gap-6">
  <Card className="bg-grey-100">
    <CardHeader>
      <CardTitle>Current Outstanding</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-h2 font-bebas">$0</div>
    </CardContent>
  </Card>
  
  <Card className="bg-grey-200">
    <CardHeader>
      <CardTitle>Last Payment Made</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-h2 font-bebas">$0</div>
    </CardContent>
  </Card>
  
  <Card className="bg-white">
    <CardHeader>
      <CardTitle>Reward Points</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-h2 font-bebas">0 POINTS</div>
      <Button variant="primary" className="mt-4">
        Redeem Now
      </Button>
    </CardContent>
  </Card>
</div>
```

### Progress Tracking
```tsx
<Card>
  <CardContent>
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span className="font-bebas">Credit Limit</span>
          <span className="font-share-tech">$2,400 / $2,400</span>
        </div>
        <Progress value={100} brutalist showBorder />
      </div>
      
      <div>
        <div className="flex justify-between mb-2">
          <span className="font-bebas">Cash Limit</span>
          <span className="font-share-tech">$2,400 / $2,400</span>
        </div>
        <Progress value={100} brutalist showBorder />
      </div>
    </div>
  </CardContent>
</Card>
```

## Best Practices

### 1. Use Greyscale for Hierarchy
```tsx
// Good: Greyscale creates visual separation
<Card className="bg-white">Primary content</Card>
<Card className="bg-grey-100">Secondary content</Card>
<Card className="bg-grey-200">Tertiary content</Card>

// Avoid: Too many nested levels
<Card className="bg-white">
  <Card className="bg-grey-100">
    <Card className="bg-grey-200">Too nested!</Card>
  </Card>
</Card>
```

### 2. Embrace Flat Design
```tsx
// Good: Flat cards with borders
<Card className="border-3 border-black shadow-none">
  Content
</Card>

// Avoid: Don't add soft shadows manually
<Card className="shadow-lg blur-sm">
  Doesn't match brutalist aesthetic
</Card>
```

### 3. Use Hard Shadows Sparingly
```tsx
// Good: Hard shadows for interactive elements
<Button className="hover:shadow-hard-base">
  Interactive
</Button>

// Good: Elevated cards only when needed
<Card className="shadow-hard-base">
  Floating above page
</Card>
```

### 4. Maintain High Contrast
```tsx
// Good: Black borders on light backgrounds
<Card className="bg-white border-black">
  High contrast
</Card>

// Good: Different background shades
<Card className="bg-grey-100 border-black">
  Subtle hierarchy
</Card>

// Avoid: Low contrast borders
<Card className="border-grey-200">
  Hard to see
</Card>
```

## Design Tokens Reference

### Updated Border Tokens
```typescript
borders.width = {
  none: '0',
  hairline: '1px',
  thin: '2px',
  base: '3px',      // Standard brutalist (NEW DEFAULT)
  thick: '4px',
  heavy: '6px',
  ultra: '8px',
}

borders.radius = {
  none: '0',        // DEFAULT for brutalist
  sm: '0.125rem',   // Minimal softening
  base: '0.25rem',  // Use sparingly
  full: '9999px',   // Circles only
}
```

### Shadow System
```typescript
shadows = {
  none: 'none',                    // PRIMARY
  flat: 'none',                    // Alias
  hard: {
    sm: '2px 2px 0 #000000',
    base: '4px 4px 0 #000000',    // Standard
    lg: '6px 6px 0 #000000',
    xl: '8px 8px 0 #000000',
  },
  hardInverse: {
    // For dark backgrounds
  },
}
```

### Semantic Colors
```typescript
semanticColors.border = {
  default: colors.black,     // Changed from grey[200]
  subtle: colors.grey[200],
  strong: colors.black,
  inverse: colors.white,
}
```

## Troubleshooting

### Issue: Components still look rounded
**Solution:** Ensure `brutalist` prop is not explicitly set to `false`

### Issue: Borders are too thin
**Solution:** Use `border-3` or update to `brutalist={true}` which defaults to thicker borders

### Issue: Too much shadow
**Solution:** Remove custom shadow classes. Brutalist defaults to `shadow-none`

### Issue: Need more visual hierarchy
**Solution:** Use different greyscale shades (`bg-grey-100`, `bg-grey-200`, etc.) to create depth and separation

## Backwards Compatibility

All components support a `brutalist` prop to toggle between styles:

- `brutalist={true}` - New neobrutalist style (default)
- `brutalist={false}` - Legacy soft minimal style

This allows gradual migration without breaking existing UI.

---

**Last Updated:** November 2025  
**Version:** 2.0.0  
**Design System:** GHXSTSHIP Neobrutalist
