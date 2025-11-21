# App Directory Structure

## Overview

The app directory follows Next.js 13+ App Router conventions with optimized route groups for maximum scalability and performance.

## Directory Structure

```
src/app/
├── (public)/              # Public marketing & auth routes
│   ├── layout.tsx         # Public layout with SEO optimization
│   ├── page.tsx           # Landing page
│   ├── about/
│   ├── blog/
│   ├── careers/
│   ├── contact/
│   ├── press/
│   ├── pricing/
│   ├── privacy/
│   ├── security/
│   ├── terms/
│   └── auth/              # Authentication pages
│       ├── login/
│       ├── register/
│       ├── forgot-password/
│       ├── reset-password/
│       ├── verify-email/
│       ├── connect-wallet/
│       └── onboarding/
│
├── (authenticated)/       # Protected user routes
│   ├── layout.tsx         # Auth check & user layout
│   ├── dashboard/
│   ├── profile/
│   ├── settings/
│   ├── notifications/
│   ├── orders/
│   ├── wallet/
│   └── wishlist/
│
├── (platforms)/           # Platform-specific routes
│   ├── atlvs/             # ATLVS Platform
│   │   ├── layout.tsx     # ATLVS layout & branding
│   │   ├── page.tsx       # ATLVS dashboard
│   │   ├── overview/
│   │   ├── advancing/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── teams/
│   │   ├── budgets/
│   │   ├── vendors/
│   │   ├── documents/
│   │   ├── assets/
│   │   ├── analytics/
│   │   ├── calendar/
│   │   ├── settings/
│   │   └── n8n/
│   │
│   ├── compvss/           # COMPVSS Platform
│   │   ├── layout.tsx     # COMPVSS layout & branding
│   │   ├── page.tsx       # COMPVSS dashboard
│   │   ├── overview/
│   │   ├── advancing/
│   │   ├── compensation/
│   │   ├── settlements/
│   │   ├── expenses/
│   │   ├── payroll/
│   │   ├── affiliates/
│   │   ├── credentials/
│   │   ├── day-of-show/
│   │   ├── issues/
│   │   ├── reports/
│   │   └── settings/
│   │
│   └── gvteway/           # GVTEWAY Platform
│       ├── layout.tsx     # GVTEWAY layout & branding
│       ├── page.tsx       # GVTEWAY home
│       ├── events/
│       ├── tickets/
│       ├── adventures/
│       ├── marketplace/
│       ├── memberships/
│       ├── cart/
│       ├── checkout/
│       ├── search/
│       ├── social/
│       └── analytics/
│
├── api/                   # API routes
│   ├── auth/              # Authentication endpoints
│   ├── atlvs/             # ATLVS API endpoints
│   ├── compvss/           # COMPVSS API endpoints
│   ├── events/            # Event management
│   ├── tickets/           # Ticket operations
│   ├── adventures/        # Adventure bookings
│   ├── marketplace/       # Marketplace operations
│   ├── memberships/       # Membership management
│   ├── social/            # Social features
│   ├── analytics/         # Analytics endpoints
│   ├── wallet/            # Wallet operations
│   ├── webhooks/          # External webhooks
│   └── integrations/      # Third-party integrations
│
├── _lib/                  # Non-routable utilities
│   ├── test/              # Test utilities
│   ├── placeholder/       # Placeholder pages
│   ├── batch/             # Batch operations
│   ├── google-places/     # Google Places integration
│   ├── n8n/               # n8n workflows
│   ├── shopify/           # Shopify integration
│   ├── spotify/           # Spotify integration
│   ├── sync/              # Data sync utilities
│   └── upload/            # Upload utilities
│
├── _config/               # Shared configurations
│   ├── metadata.ts        # SEO & metadata config
│   ├── routes.ts          # Route definitions
│   └── constants.ts       # App-wide constants
│
├── layout.tsx             # Root layout
├── page.tsx               # Root redirect
├── error.tsx              # Global error boundary
├── not-found.tsx          # 404 page
├── providers.tsx          # Context providers
├── globals.css            # Global styles
└── favicon.ico            # Favicon
```

## Route Groups Explained

### `(public)` - Public Routes
- **Purpose**: Marketing pages, blog, legal pages, and authentication
- **SEO**: Fully indexed and optimized for search engines
- **Auth**: No authentication required
- **Layout**: Minimal layout with navbar and footer

### `(authenticated)` - Protected Routes
- **Purpose**: User dashboard, profile, settings, and personal data
- **SEO**: No-index (private user data)
- **Auth**: Requires authentication, redirects to login if not authenticated
- **Layout**: User-focused layout with sidebar navigation

### `(platforms)` - Platform Routes
- **Purpose**: Platform-specific features for ATLVS, COMPVSS, and GVTEWAY
- **SEO**: Conditional indexing based on platform
- **Auth**: Platform-specific authentication and permissions
- **Layout**: Platform-branded layouts with custom navigation

Each platform has its own:
- Layout with platform-specific branding
- Navigation structure
- Color scheme and design system
- Feature set

### `api/` - API Routes
- **Purpose**: Backend API endpoints
- **Organization**: Grouped by domain/feature
- **Versioning**: Can add `/v1/`, `/v2/` prefixes as needed
- **Testing**: Co-located `__tests__/` directories

### `_lib/` - Non-Routable Utilities
- **Purpose**: Development utilities, integrations, batch operations
- **Routing**: Underscore prefix makes these non-routable
- **Usage**: Internal tools, test pages, admin utilities

### `_config/` - Shared Configuration
- **Purpose**: Centralized configuration files
- **Routing**: Non-routable (underscore prefix)
- **Usage**: Import from anywhere in the app

## Benefits of This Structure

### 1. **Scalability**
- Clear separation of concerns
- Easy to add new platforms or features
- Modular organization

### 2. **Performance**
- Route groups enable parallel loading
- Platform-specific code splitting
- Optimized bundle sizes

### 3. **Developer Experience**
- Intuitive file organization
- Easy to find and modify code
- Clear ownership boundaries

### 4. **SEO Optimization**
- Proper metadata hierarchy
- Conditional indexing
- Platform-specific SEO

### 5. **Maintainability**
- Consistent patterns
- Centralized configuration
- Easy to refactor

## Migration Guide

### From `(rebuild)` to New Structure

1. **Public Pages**: Move to `(public)/`
   ```bash
   mv src/app/(rebuild)/about src/app/(public)/about
   ```

2. **Authenticated Pages**: Move to `(authenticated)/`
   ```bash
   mv src/app/(rebuild)/dashboard src/app/(authenticated)/dashboard
   ```

3. **Platform Pages**: Move to `(platforms)/{platform}/`
   ```bash
   mv src/app/(rebuild)/atlvs/* src/app/(platforms)/atlvs/
   ```

4. **Update Imports**: Use centralized route config
   ```typescript
   import { routes } from '@/app/_config/routes';
   // Use routes.atlvs.projects.list instead of hardcoded paths
   ```

5. **Update Metadata**: Use shared metadata config
   ```typescript
   import { atlvsMetadata } from '@/app/_config/metadata';
   export const metadata = atlvsMetadata;
   ```

## Best Practices

1. **Use Route Groups**: Organize by user intent, not just URL structure
2. **Centralize Config**: Use `_config/` for shared constants and routes
3. **Co-locate Tests**: Keep `__tests__/` next to the code being tested
4. **Lazy Load**: Use dynamic imports for heavy components
5. **Optimize Metadata**: Use template metadata for consistent SEO
6. **Type Safety**: Export route types from `_config/routes.ts`

## Performance Optimizations

1. **Code Splitting**: Each route group is automatically code-split
2. **Parallel Routes**: Use `@folder` syntax for parallel loading
3. **Loading States**: Add `loading.tsx` for instant feedback
4. **Error Boundaries**: Add `error.tsx` for graceful error handling
5. **Metadata**: Use `generateMetadata` for dynamic SEO

## Security Considerations

1. **Authentication**: Implement in `(authenticated)/layout.tsx`
2. **Authorization**: Check permissions in platform layouts
3. **API Routes**: Validate requests in middleware
4. **Environment Variables**: Never expose secrets in client code
5. **Rate Limiting**: Implement in API routes

## Future Enhancements

1. **Internationalization**: Add `[locale]` dynamic segment
2. **Multi-tenancy**: Add `[tenant]` for white-label support
3. **A/B Testing**: Use parallel routes for experiments
4. **Analytics**: Add tracking in layout components
5. **Monitoring**: Implement error tracking in error boundaries
