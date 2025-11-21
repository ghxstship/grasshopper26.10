# UI Rebuild Guide - GHXSTSHIP Design System

## Overview

Complete UI rebuild using Contemporary Minimal Pop Art aesthetic with strict monochromatic color palette and brutalist design principles. All backend functionality and API endpoints preserved.

## Design System

### Typography Stack
- **Display/Headers**: ANTON (all caps, bold statements)
- **Subheads/UI**: BEBAS NEUE (clean, modern hierarchy)
- **Body/Interface**: SHARE TECH (technical precision)

### Color System
- **Strict Monochromatic**: #000000, #FFFFFF, greyscale spectrum only
- **High Contrast**: Maximum readability, brutalist clarity
- **No Gradients**: Pure, flat colors (except for legacy platform branding)

### Design Philosophy
- Brutalist aesthetics with sharp edges
- High-contrast, maximum readability
- Minimal, functional UI elements
- Bold typography hierarchy
- Brutalist shadows (8px 8px 0 0 rgba(0,0,0,1))

## Architecture

### Component Structure
```
src/components/ui-rebuild/
├── atoms/           # Basic building blocks
│   ├── Button.tsx
│   ├── Typography.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   └── Spinner.tsx
├── molecules/       # Composite components
│   ├── FormField.tsx
│   └── SearchBar.tsx
└── organisms/       # Complex components
    ├── Navbar.tsx
    └── Footer.tsx
```

### API Integration
- **Client**: `/src/lib/api/client.ts` - Modern fetch-based HTTP client
- **Interceptors**: Request/response middleware support
- **Error Handling**: Comprehensive error types and responses
- **Authentication**: JWT token management with auto-refresh

## Backend Preservation

### API Endpoints (227 total)
All existing API endpoints preserved and functional:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### GVTEWAY (Consumer Platform)
- **Events**: `/api/events` - List, create, update, delete events
- **Tickets**: `/api/tickets` - Purchase, validate, transfer tickets
- **Orders**: `/api/orders` - Order management
- **Adventures**: `/api/adventures` - Book VIP experiences
- **Memberships**: `/api/memberships` - Subscription management
- **Social**: `/api/social` - Posts, comments, likes, follows

#### COMPVSS (External Team Platform)
- **Advancing**: `/api/compvss/advancing` - Request management
- **QR Codes**: `/api/compvss/qr` - Generate and scan QR codes
- **Teams**: `/api/compvss/teams` - Team management
- **Expenses**: `/api/compvss/expenses` - Expense reporting
- **Opportunities**: `/api/compvss/opportunities` - Job postings

#### ATLVS (Internal Team Platform)
- **Projects**: `/api/atlvs/projects` - Project management
- **Tasks**: `/api/atlvs/tasks` - Task tracking
- **Equipment**: `/api/atlvs/equipment` - Equipment booking
- **Time Tracking**: `/api/atlvs/time` - Time entries
- **Documents**: `/api/atlvs/documents` - Document management

### Database Schema
- **88 Prisma Models** - Complete relational database
- **PostgreSQL** with Supabase
- **Role-Based Access Control** - 6 user roles with granular permissions

## Implementation Examples

### Example Pages Created
1. **Landing Page**: `/src/app/(rebuild)/page.tsx`
   - Hero section with brutalist design
   - Feature cards
   - Stats section
   - CTA section

2. **Events Page**: `/src/app/(rebuild)/events/page.tsx`
   - API-integrated event listing
   - Search and filter functionality
   - Real-time data fetching
   - Responsive grid layout

3. **Login Page**: `/src/app/(rebuild)/auth/login/page.tsx`
   - Form validation
   - API authentication
   - Token management
   - Error handling

4. **Register Page**: `/src/app/(rebuild)/auth/register/page.tsx`
   - Multi-field validation
   - Password confirmation
   - Terms acceptance
   - API integration

## Usage Guide

### Using Atomic Components

```tsx
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Body>Content goes here</Body>
        <Button variant="primary">Click Me</Button>
      </CardContent>
    </Card>
  );
}
```

### API Integration

```tsx
import { apiClient } from '@/lib/api/client';

// GET request
const { data } = await apiClient.get('/api/events');

// POST request
const { data } = await apiClient.post('/api/events', {
  name: 'New Event',
  startDate: '2025-12-01',
});

// With authentication
apiClient.setAuthToken(token);
const { data } = await apiClient.get('/api/profile');
```

### Form Handling

```tsx
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Button } from '@/components/ui-rebuild/atoms/Button';

function MyForm() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  return (
    <form>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error={!!error}
        helperText={error}
        placeholder="Enter value"
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Migration Strategy

### Phase 1: Foundation (Complete)
- ✅ Design system tokens
- ✅ Atomic components (atoms)
- ✅ Molecular components (molecules)
- ✅ Organism components (organisms)
- ✅ API client layer

### Phase 2: Core Pages (In Progress)
- ✅ Landing page
- ✅ Events listing
- ✅ Authentication pages
- ⏳ Event detail page
- ⏳ Dashboard pages
- ⏳ Profile pages

### Phase 3: Platform-Specific Features
- ⏳ GVTEWAY consumer features
- ⏳ COMPVSS team management
- ⏳ ATLVS project management

### Phase 4: Polish & Optimization
- ⏳ Performance optimization
- ⏳ Accessibility audit (WCAG 2.1 AA)
- ⏳ Cross-browser testing
- ⏳ Mobile responsiveness
- ⏳ SEO optimization

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Performance**: > 90
- **Bundle Size**: Optimized with code splitting

## Accessibility Standards

- **WCAG 2.1 AA Compliance**: Minimum standard
- **Semantic HTML**: Throughout all components
- **Keyboard Navigation**: Full support
- **Screen Reader**: Compatible
- **Focus Management**: Proper focus indicators

## Testing Strategy

### Unit Tests
- Component rendering
- User interactions
- API integration mocks

### Integration Tests
- User flows
- API endpoint connections
- Form submissions

### E2E Tests (Playwright)
- Critical user journeys
- Cross-browser compatibility
- Mobile responsiveness

## Environment Setup

### Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe (if using payments)
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

### Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Database commands
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:studio
```

## Deployment

### Production Build
```bash
npm run build
npm run start
```

### Vercel Deployment
- Automatic deployments from main branch
- Preview deployments for PRs
- Environment variables configured in Vercel dashboard

## Support & Documentation

- **API Documentation**: `/docs/api/API_DOCUMENTATION.md`
- **Architecture Docs**: `/docs/architecture/`
- **Component Storybook**: Coming soon
- **Style Guide**: This document

## Next Steps

1. Complete remaining core pages (event detail, dashboard)
2. Implement platform-specific features
3. Add comprehensive test coverage
4. Perform accessibility audit
5. Optimize performance
6. Deploy to production

---

**Last Updated**: November 20, 2025
**Version**: 1.0.0
**Status**: Foundation Complete, Core Pages In Progress
