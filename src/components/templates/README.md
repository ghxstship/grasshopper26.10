# Templates - GHXSTSHIP Atomic Design System

Templates are the highest level in our atomic design hierarchy. They combine organisms and molecules to create complete page layouts with consistent structure and behavior.

## Layout Templates

### Platform Layouts
These wrap entire platform sections with Navigation and Footer:

- **`AtlvsLayout`** - For ATLVS (internal teams) pages
- **`CompvssLayout`** - For COMPVSS (external teams) pages  
- **`GvtewayLayout`** - For GVTEWAY (membership) pages

**Usage:**
```tsx
import { CompvssLayout } from '@/components/templates/CompvssLayout';

export default function MyPage() {
  return (
    <CompvssLayout>
      {/* Page content */}
    </CompvssLayout>
  );
}
```

### ContentLayout
The primary content wrapper that provides:
- Page title and description
- Breadcrumb navigation
- Toolbar with search, filters, and actions
- Consistent spacing and styling

**Usage:**
```tsx
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

export default function MyPage() {
  const router = useRouter();
  
  return (
    <CompvssLayout>
      <ContentLayout
        title="Page Title"
        description="Page description"
        variant="compvss"
        breadcrumbs={[
          { label: 'Dashboard', href: '/compvss/dashboard' },
          { label: 'Current Page' }
        ]}
        primaryAction={{
          label: 'Create New',
          icon: <Plus className="w-5 h-5" />,
          onClick: () => router.push('/path'),
          variant: 'compvss'
        }}
      >
        {/* Page content */}
      </ContentLayout>
    </CompvssLayout>
  );
}
```

## Page Templates

Specialized templates for common page patterns:

### Data Display
- **`ListPageTemplate`** - Lists with filtering and pagination
- **`DetailPageTemplate`** - Single item detail views
- **`DashboardPageTemplate`** - Dashboard with stats and widgets
- **`SearchResultsPageTemplate`** - Search results with filters

### Forms & Actions
- **`FormPageTemplate`** - Forms with validation
- **`WizardPageTemplate`** - Multi-step processes
- **`CheckoutPageTemplate`** - Checkout flows

### User Management
- **`ProfilePageTemplate`** - User profiles
- **`SettingsPageTemplate`** - Settings pages

### Utilities
- **`ErrorPageTemplate`** - Error states (404, 500, etc.)
- **`ComparisonPageTemplate`** - Side-by-side comparisons

## Migration Pattern

When migrating pages to the atomic design system:

1. **Wrap with Platform Layout**
   ```tsx
   <CompvssLayout>
   ```

2. **Add ContentLayout**
   ```tsx
   <ContentLayout
     title="..."
     description="..."
     variant="compvss"
     breadcrumbs={[...]}
   >
   ```

3. **Use Atomic Components**
   - Replace custom components with atoms (Button, Card, Badge, etc.)
   - Use GHXSTSHIP typography (font-bebas, font-oswald, font-share-tech)
   - Apply platform color palette (compvss-cyan-500, atlvs-orange-500, etc.)

4. **Remove Custom Headers**
   - Delete manual header/title sections
   - Let ContentLayout handle page structure

## Variants

All templates support platform variants:
- `default` - Standard styling
- `compvss` - COMPVSS cyan/teal theme
- `atlvs` - ATLVS orange theme
- `gvteway` - GVTEWAY purple theme

## Best Practices

1. **Always use platform layouts** - Don't create pages without CompvssLayout/AtlvsLayout/GvtewayLayout
2. **Prefer ContentLayout** - Use it for consistent page structure
3. **Use breadcrumbs** - Help users navigate the hierarchy
4. **Add primary actions** - Make key actions easily accessible
5. **Follow atomic design** - Build up from atoms → molecules → organisms → templates
6. **Maintain consistency** - Use the same patterns across similar pages

## Examples

See migrated pages for reference:
- `/src/app/compvss/credentials/vault/page.tsx`
- `/src/app/compvss/issues/dashboard/page.tsx`
- `/src/app/compvss/dashboard/page.tsx`
