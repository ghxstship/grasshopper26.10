# Automation Guide

**Tools for automating page migration and test generation**

## Overview

Two powerful automation scripts are available to accelerate development:

1. **Page Migration Tool** - Automatically applies PageWrapper and state management
2. **Test Generation Tool** - Automatically generates test files with templates

---

## Page Migration Tool

### Quick Start

```bash
# Dry run (see what would be migrated)
npm run migrate-pages

# Apply migrations to all pages
npm run migrate-pages -- --apply

# Migrate specific app
npm run migrate-pages -- --apply gvteway
npm run migrate-pages -- --apply compvss
npm run migrate-pages -- --apply atlvs
```

### What It Does

- ✅ Adds `PageWrapper` with breadcrumbs
- ✅ Adds `usePageState` hook for data fetching
- ✅ Adds `LoadingState` component
- ✅ Adds `ErrorState` with retry functionality
- ✅ Adds `EmptyState` for no data scenarios
- ✅ Creates backup of original file (.backup extension)

### Example Transformation

**Before:**
```typescript
export default function EventsPage() {
  return <div>Events</div>;
}
```

**After:**
```typescript
import { PageWrapper } from '@/components/templates/PageWrapper';
import { usePageState } from '@/hooks/usePageState';
import { LoadingState } from '@/components/molecules/LoadingState';
import { ErrorState } from '@/components/molecules/ErrorState';

export default function EventsPage() {
  const { data, isLoading, error, refetch } = usePageState({
    queryKey: ['gvteway', 'list'],
    queryFn: async () => {
      return await fetchEvents();
    },
  });

  return (
    <PageWrapper
      title="Events"
      breadcrumbs={[
        { label: 'Home', href: '/gvteway' },
        { label: 'Events' },
      ]}
    >
      {isLoading && <LoadingState />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}
      {data && <div>{/* Content */}</div>}
    </PageWrapper>
  );
}
```

### Progress Tracking

The tool shows:
- Total pages found
- Pages already migrated
- Pages needing migration
- Breakdown by app (GVTEWAY, COMPVSS, ATLVS)
- Breakdown by type (list, detail, form, dashboard, auth)

---

## Test Generation Tool

### Quick Start

```bash
# Dry run (see what tests would be generated)
npm run generate-tests

# Generate all missing tests
npm run generate-tests -- --apply

# Generate tests for specific type
npm run generate-tests -- --apply service
npm run generate-tests -- --apply hook
npm run generate-tests -- --apply component
npm run generate-tests -- --apply utility
```

### What It Generates

**Service Tests:**
- CRUD operation tests
- Error handling tests
- Business logic tests
- Prisma mock setup

**Hook Tests:**
- Data fetching tests
- Loading state tests
- Error handling tests
- Refetch functionality tests
- React Query wrapper setup

**Component Tests:**
- Render tests
- User interaction tests
- Props handling tests
- Accessibility tests

**Utility Tests:**
- Basic functionality tests
- Edge case tests
- Error handling tests
- Performance tests

### Example Generated Test

**Service Test:**
```typescript
import { EventService } from '@/lib/services/gvteway/event.service';

describe('EventService', () => {
  describe('CRUD Operations', () => {
    it('should create a record', async () => {
      const data = { name: 'Test Event' };
      const result = await EventService.create(data);
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle not found errors', async () => {
      await expect(EventService.findById('invalid')).rejects.toThrow();
    });
  });
});
```

---

## NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "migrate-pages": "tsx scripts/migrate-pages.ts",
    "generate-tests": "tsx scripts/generate-tests.ts",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Workflow

### 1. Initial Setup

```bash
# Install dependencies
npm install -D tsx glob

# Run dry runs to see what would happen
npm run migrate-pages
npm run generate-tests
```

### 2. Migrate Pages (App by App)

```bash
# Start with one app
npm run migrate-pages -- --apply gvteway

# Review changes
git diff

# If satisfied, commit
git add .
git commit -m "feat: migrate GVTEWAY pages to PageWrapper"

# Repeat for other apps
npm run migrate-pages -- --apply compvss
npm run migrate-pages -- --apply atlvs
```

### 3. Generate Tests

```bash
# Generate service tests first
npm run generate-tests -- --apply service

# Then hooks
npm run generate-tests -- --apply hook

# Then components
npm run generate-tests -- --apply component

# Finally utilities
npm run generate-tests -- --apply utility
```

### 4. Review and Customize

```bash
# Run tests to see what needs customization
npm test

# Fix failing tests
# Update test data
# Add specific assertions
```

---

## Customization

### Customize Page Template

Edit `scripts/migrate-pages.ts` function `generatePageTemplate()`:

```typescript
function generatePageTemplate(pageInfo: PageInfo, originalContent: string): string {
  // Customize template here
  return `...`;
}
```

### Customize Test Templates

Edit `scripts/generate-tests.ts` functions:
- `generateServiceTest()`
- `generateHookTest()`
- `generateComponentTest()`
- `generateUtilityTest()`

---

## Safety Features

### Page Migration
- ✅ Dry run by default
- ✅ Creates `.backup` files
- ✅ Shows preview before applying
- ✅ Can filter by app

### Test Generation
- ✅ Dry run by default
- ✅ Never overwrites existing tests
- ✅ Shows preview before applying
- ✅ Can filter by type

---

## Troubleshooting

**Migration fails for a page?**
- Check if page has unusual structure
- Review backup file
- Manually migrate if needed

**Generated test doesn't run?**
- Update imports
- Add missing mocks
- Customize test data

**Too many files to migrate?**
- Use app filter: `--apply gvteway`
- Migrate in batches
- Review and commit frequently

---

## Best Practices

1. **Always run dry run first**
2. **Migrate one app at a time**
3. **Review changes before committing**
4. **Keep backups until verified**
5. **Customize generated code**
6. **Run tests after generation**
7. **Update templates as needed**

---

## Metrics

### Expected Results

**Page Migration:**
- 262 pages need migration
- ~5 minutes for dry run
- ~10 minutes to apply all
- ~2 hours to review and customize

**Test Generation:**
- ~200 files need tests
- ~2 minutes for dry run
- ~5 minutes to generate all
- ~8 hours to customize and fix

### ROI

**Without Automation:**
- 262 pages × 15 min = 65 hours
- 200 tests × 20 min = 67 hours
- **Total: 132 hours**

**With Automation:**
- Migration: 2 hours
- Test generation: 8 hours
- **Total: 10 hours**

**Time Saved: 122 hours (92% reduction)**

---

## Next Steps

1. Run dry runs to assess scope
2. Start with one app for pages
3. Generate tests for completed features
4. Review and customize generated code
5. Run full test suite
6. Deploy with confidence!
