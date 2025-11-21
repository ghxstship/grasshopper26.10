# App Directory Reorganization Guide

## Overview

This guide explains the app directory reorganization for maximum scalability and performance using Next.js 13+ App Router best practices.

## What Changed

### Before (Old Structure)
```
src/app/
├── (rebuild)/          # All pages mixed together
├── api/                # 295 items, poorly organized
├── test/               # Routable (bad)
├── placeholder/        # Routable (bad)
├── batch/              # Routable (bad)
└── Various integrations at root level
```

### After (New Structure)
```
src/app/
├── (public)/           # Public marketing & auth
├── (authenticated)/    # Protected user pages
├── (platforms)/        # ATLVS, COMPVSS, GVTEWAY
│   ├── atlvs/
│   ├── compvss/
│   └── gvteway/
├── api/                # Organized by domain
├── _lib/               # Non-routable utilities
├── _config/            # Shared configuration
└── Root files
```

## Key Improvements

### 1. Route Groups for Organization
- `(public)` - Marketing, blog, auth pages
- `(authenticated)` - User dashboard, settings
- `(platforms)` - Platform-specific features

**Benefits:**
- Better code organization
- Easier to find files
- Clear separation of concerns
- Improved bundle splitting

### 2. Platform-Specific Layouts
Each platform has its own layout with:
- Custom branding and colors
- Platform-specific navigation
- Optimized metadata
- Independent styling

### 3. Centralized Configuration
- `_config/metadata.ts` - SEO and metadata
- `_config/routes.ts` - All route definitions
- `_config/constants.ts` - App-wide constants

**Benefits:**
- Single source of truth
- Type-safe route references
- Easy to update
- Consistent across app

### 4. API Organization
- Grouped by domain (auth, platforms, shared)
- Standardized response format
- Shared utilities and middleware
- Better error handling

### 5. Non-Routable Utilities
- `_lib/` for dev tools and integrations
- Underscore prefix prevents routing
- Keeps app directory clean

## Migration Steps

### Automated Migration

```bash
# Make scripts executable
chmod +x scripts/reorganize-app-directory.sh
chmod +x scripts/migrate-to-new-structure.sh

# Run migration
./scripts/migrate-to-new-structure.sh
```

### Manual Migration (if needed)

#### 1. Move Public Pages
```bash
mv src/app/(rebuild)/about src/app/(public)/
mv src/app/(rebuild)/blog src/app/(public)/
mv src/app/(rebuild)/auth src/app/(public)/
# ... etc
```

#### 2. Move Authenticated Pages
```bash
mv src/app/(rebuild)/dashboard src/app/(authenticated)/
mv src/app/(rebuild)/profile src/app/(authenticated)/
# ... etc
```

#### 3. Move Platform Pages
```bash
# ATLVS
mv src/app/(rebuild)/atlvs/* src/app/(platforms)/atlvs/

# COMPVSS
mv src/app/(rebuild)/compvss/* src/app/(platforms)/compvss/

# GVTEWAY
mv src/app/(rebuild)/events src/app/(platforms)/gvteway/
mv src/app/(rebuild)/tickets src/app/(platforms)/gvteway/
# ... etc
```

#### 4. Move Utilities
```bash
mv src/app/test src/app/_lib/
mv src/app/placeholder src/app/_lib/
mv src/app/batch src/app/_lib/
# ... etc
```

## Post-Migration Tasks

### 1. Update Imports

**Before:**
```typescript
import { Button } from '@/components/atoms/Button';
// Hardcoded route
const eventUrl = '/events/123';
```

**After:**
```typescript
import { Button } from '@/components/atoms/Button';
import { routes } from '@/app/_config/routes';

// Type-safe route
const eventUrl = routes.gvteway.events.detail('123');
```

### 2. Update Metadata

**Before:**
```typescript
export const metadata = {
  title: 'ATLVS Dashboard',
  description: 'Project management dashboard',
};
```

**After:**
```typescript
import { atlvsMetadata } from '@/app/_config/metadata';

export const metadata = {
  ...atlvsMetadata,
  title: 'Dashboard',
};
```

### 3. Update API Calls

**Before:**
```typescript
const response = await fetch('/api/events');
```

**After:**
```typescript
import { routes } from '@/app/_config/routes';

const response = await fetch(routes.api.events);
```

### 4. Update Tests

```typescript
// Update test imports and paths
import { routes } from '@/app/_config/routes';

test('navigates to events', () => {
  router.push(routes.gvteway.events.list);
});
```

## Verification

### 1. Type Check
```bash
npx tsc --noEmit
```

### 2. Build Check
```bash
npm run build
```

### 3. Dev Server
```bash
npm run dev
```

### 4. Test Routes
Visit each route group:
- http://localhost:3000 (should redirect)
- http://localhost:3000/(public)
- http://localhost:3000/(authenticated)/dashboard
- http://localhost:3000/(platforms)/atlvs
- http://localhost:3000/(platforms)/compvss
- http://localhost:3000/(platforms)/gvteway

## Common Issues

### Issue: 404 on routes
**Solution:** Check that files were moved correctly and route groups are named with parentheses.

### Issue: Import errors
**Solution:** Update import paths to use new structure.

### Issue: Layout not applying
**Solution:** Ensure layout.tsx exists in route group directory.

### Issue: Metadata not working
**Solution:** Check that metadata is exported from layout or page.

## Best Practices

### 1. Use Route Config
Always use `routes` from `_config/routes.ts` instead of hardcoded paths.

### 2. Use Metadata Config
Import and extend metadata from `_config/metadata.ts`.

### 3. Co-locate Related Files
Keep components, hooks, and utilities close to where they're used.

### 4. Use Loading States
Add `loading.tsx` for better UX.

### 5. Use Error Boundaries
Add `error.tsx` for graceful error handling.

## Performance Benefits

### Before
- Single large bundle
- All routes loaded together
- No code splitting by feature
- Slow initial load

### After
- Route-based code splitting
- Platform-specific bundles
- Lazy loading by default
- Faster initial load
- Better caching

## SEO Benefits

### Before
- Inconsistent metadata
- No platform-specific SEO
- Mixed indexing strategy

### After
- Centralized metadata
- Platform-specific SEO
- Proper indexing per route group
- Better search rankings

## Developer Experience

### Before
- Hard to find files
- Unclear organization
- Mixed concerns
- Difficult to scale

### After
- Intuitive structure
- Clear organization
- Separated concerns
- Easy to scale

## Next Steps

1. ✅ Complete migration
2. ✅ Update all imports
3. ✅ Test all routes
4. ✅ Verify build
5. ⬜ Update documentation
6. ⬜ Train team on new structure
7. ⬜ Monitor performance
8. ⬜ Gather feedback

## Resources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

## Support

For questions or issues:
1. Check documentation in `docs/architecture/`
2. Review migration scripts in `scripts/`
3. Check existing examples in codebase
4. Ask team for help

## Rollback Plan

If migration causes issues:

```bash
# Restore from git
git checkout HEAD -- src/app/

# Or restore from backup
cp -r .backup/app/* src/app/
```

Always test in development before deploying to production.
