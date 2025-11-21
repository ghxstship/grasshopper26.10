# Design System Consolidation Plan

## Current State Analysis

### Duplication Issues
1. **Design tokens defined in 3 places:**
   - `/tailwind.config.ts` - Tailwind theme extensions
   - `/src/design-system/tokens/` - TypeScript token definitions
   - Components using hardcoded Tailwind classes

2. **No single source of truth:**
   - Colors, typography, spacing defined multiple times
   - Components don't consume design tokens
   - Changes require updates in multiple locations

### Current Structure
```
src/
├── components/           # Atomic design components
│   ├── atoms/           # 27 components
│   ├── molecules/       # 24 components
│   ├── organisms/       # 22 components
│   └── templates/       # 19 components
└── design-system/       # Design tokens (unused)
    ├── tokens/
    │   ├── primitives/  # colors, typography, spacing, etc.
    │   └── themes/      # light, dark, high-contrast
    └── utils/
```

## Proposed Unified Structure

```
src/design-system/
├── index.ts                    # Main export - single import point
│
├── tokens/                     # Design tokens (single source of truth)
│   ├── index.ts               # Unified token export
│   ├── primitives/            # Core design tokens
│   │   ├── colors.ts          # Monochromatic palette
│   │   ├── typography.ts      # Font system
│   │   ├── spacing.ts         # Spacing scale
│   │   ├── borders.ts         # Border & shadow tokens
│   │   ├── animations.ts      # Animation tokens
│   │   └── breakpoints.ts     # Responsive breakpoints
│   └── themes/                # Theme configurations
│       ├── light.ts
│       ├── dark.ts
│       └── high-contrast.ts
│
├── primitives/                 # Atomic components (atoms)
│   ├── index.ts
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.styles.ts   # Token-based styles
│   │   └── Button.test.tsx
│   ├── Input/
│   ├── Card/
│   └── Typography/
│
├── components/                 # Composite components
│   ├── index.ts
│   ├── molecules/             # Simple combinations
│   │   ├── FormField/
│   │   ├── SearchBar/
│   │   └── ...
│   └── organisms/             # Complex sections
│       ├── Navbar/
│       ├── Sidebar/
│       └── ...
│
├── templates/                  # Page layouts
│   ├── index.ts
│   ├── DashboardLayout/
│   ├── GvtewayLayout/
│   └── ...
│
├── hooks/                      # Design system hooks
│   ├── useTheme.ts
│   ├── useBreakpoint.ts
│   └── useDesignTokens.ts
│
├── utils/                      # Design system utilities
│   ├── cn.ts                  # Class name utility
│   ├── variants.ts            # Variant generator
│   └── focus-management.ts
│
└── types/                      # TypeScript types
    ├── tokens.ts
    ├── variants.ts
    └── components.ts
```

## Migration Strategy

### Phase 1: Token Consolidation ✓
1. Keep `/src/design-system/tokens/` as single source of truth
2. Generate Tailwind config from tokens (not vice versa)
3. Create token consumption utilities

### Phase 2: Component Migration
1. Move `/src/components/` → `/src/design-system/`
2. Restructure as: primitives/ + components/ + templates/
3. Update all imports across codebase

### Phase 3: Token Integration
1. Update components to consume design tokens
2. Replace hardcoded Tailwind classes with token-based styles
3. Create variant system using tokens

### Phase 4: Documentation & Cleanup
1. Update all documentation
2. Remove old `/src/components/` directory
3. Verify single source of truth

## Benefits

### 1. Single Source of Truth
- All design decisions in one place
- Tokens drive everything (Tailwind, components, docs)
- Changes propagate automatically

### 2. Type Safety
- TypeScript tokens with autocomplete
- Compile-time validation
- Better DX with IntelliSense

### 3. Consistency
- Components consume tokens, not arbitrary values
- Platform variants (ATLVS, COMPVSS, GVTEWAY) from tokens
- Enforced design system compliance

### 4. Maintainability
- Update tokens, not components
- Clear hierarchy: tokens → primitives → components → templates
- Easier onboarding and debugging

### 5. Scalability
- Easy to add new themes
- Simple to extend token system
- Clear patterns for new components

## Import Pattern (After Migration)

```typescript
// Single import point for everything
import { 
  // Tokens
  tokens,
  
  // Primitives (atoms)
  Button,
  Input,
  Card,
  Typography,
  
  // Components (molecules + organisms)
  FormField,
  SearchBar,
  Navbar,
  Sidebar,
  
  // Templates
  DashboardLayout,
  GvtewayLayout,
  
  // Hooks
  useTheme,
  useBreakpoint,
  
  // Utils
  cn,
  createVariants,
} from '@/design-system';
```

## Token Consumption Example

```typescript
// Before (hardcoded)
<button className="bg-black text-white font-bebas text-h2">
  Click me
</button>

// After (token-based)
import { Button } from '@/design-system';

<Button variant="atlvs" size="lg">
  Click me
</Button>

// Button internally uses:
// - tokens.colors.black
// - tokens.typography.fontFamily.bebas
// - tokens.typography.fontSize.h2
```

## Rollout Plan

1. **Week 1:** Token consolidation + utilities
2. **Week 2:** Migrate primitives (atoms)
3. **Week 3:** Migrate components (molecules + organisms)
4. **Week 4:** Migrate templates + update all imports
5. **Week 5:** Documentation + cleanup + verification

## Success Criteria

- ✓ Single `/src/design-system/` directory
- ✓ All components consume tokens
- ✓ No hardcoded design values in components
- ✓ Tailwind config generated from tokens
- ✓ All imports from `@/design-system`
- ✓ Complete TypeScript coverage
- ✓ Updated documentation
