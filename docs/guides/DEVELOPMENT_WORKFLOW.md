# Development Workflow Guide

**Version:** 1.0.0  
**Last Updated:** November 15, 2025

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Environment](#development-environment)
3. [Git Workflow](#git-workflow)
4. [Code Standards](#code-standards)
5. [Testing Workflow](#testing-workflow)
6. [Pull Request Process](#pull-request-process)
7. [Common Tasks](#common-tasks)

---

## Getting Started

### Initial Setup

```bash
# Clone repository
git clone https://github.com/your-org/gvteway-atlvs.git
cd gvteway-atlvs

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Set up database
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

### Project Structure

```
gvteway-atlvs/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── gvteway/      # GVTEWAY platform pages
│   │   ├── compvss/      # COMPVSS platform pages
│   │   └── atlvs/        # ATLVS platform pages
│   ├── components/       # React components (Atomic Design)
│   │   ├── atoms/        # Basic UI elements
│   │   ├── molecules/    # Composite components
│   │   ├── organisms/    # Complex components
│   │   └── templates/    # Page layouts
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   │   ├── db/           # Database utilities
│   │   ├── integrations/ # Third-party integrations
│   │   └── utils/        # Helper functions
│   └── types/            # TypeScript type definitions
├── prisma/               # Database schema & migrations
├── public/               # Static assets
├── e2e/                  # End-to-end tests
├── docs/                 # Documentation
└── contracts/            # Smart contracts
```

---

## Development Environment

### Required Tools

- **Node.js** 18+
- **npm** or **yarn**
- **PostgreSQL** 14+
- **Redis** 7+
- **Git**
- **VS Code** (recommended)

### VS Code Extensions

Install recommended extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright"
  ]
}
```

### Environment Variables

Required variables in `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Stripe (test mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Other services (optional for local dev)
SENDGRID_API_KEY="..."
SENTRY_DSN="..."
```

---

## Git Workflow

### Branch Strategy

We use **Git Flow**:

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

### Creating a Feature Branch

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/ticket-123-add-search

# Make changes and commit
git add .
git commit -m "feat: add global search functionality"

# Push to remote
git push origin feature/ticket-123-add-search
```

### Commit Message Convention

Follow **Conventional Commits**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(gvteway): add event search functionality

Implement global search for events with filters
- Add search API endpoint
- Create useSearch hook
- Add search UI component

Closes #123
```

```bash
fix(compvss): resolve advancing form validation issue

Fix validation error when submitting advancing requests
with empty optional fields

Fixes #456
```

---

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Export types from dedicated files

```typescript
// Good
interface Event {
  id: string;
  name: string;
  startDate: Date;
}

export function getEvent(id: string): Promise<Event> {
  // ...
}

// Avoid
function getEvent(id: any): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- Follow Atomic Design principles
- Use proper prop types
- Keep components focused and small

```typescript
// components/molecules/EventCard.tsx
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';

interface EventCardProps {
  event: Event;
  onSelect: (id: string) => void;
}

export function EventCard({ event, onSelect }: EventCardProps) {
  return (
    <Card>
      <h3>{event.name}</h3>
      <Button onClick={() => onSelect(event.id)}>
        View Details
      </Button>
    </Card>
  );
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow design system variants
- Keep styles consistent across platforms

```tsx
// Platform-specific variants
<Button variant="gvteway">GVTEWAY Action</Button>
<Button variant="compvss">COMPVSS Action</Button>
<Button variant="atlvs">ATLVS Action</Button>
```

### API Routes

- Use proper HTTP methods
- Implement authentication
- Add input validation
- Return consistent responses

```typescript
// src/app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const eventSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().datetime(),
});

export async function POST(request: NextRequest) {
  try {
    // Validate input
    const body = await request.json();
    const data = eventSchema.parse(body);

    // Process request
    const event = await createEvent(data);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Testing Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Writing Tests

#### Unit Tests

```typescript
// src/hooks/__tests__/useEvents.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useEvents } from '../useEvents';

describe('useEvents', () => {
  it('should fetch events successfully', async () => {
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.events).toBeDefined();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
```

#### Integration Tests

```typescript
// src/app/api/__tests__/events.test.ts
import { POST } from '../events/route';

describe('POST /api/events', () => {
  it('should create event with valid data', async () => {
    const request = new Request('http://localhost/api/events', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Event',
        startDate: '2025-07-15T18:00:00Z',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });
});
```

#### E2E Tests

```typescript
// e2e/events.spec.ts
import { test, expect } from '@playwright/test';

test('user can create event', async ({ page }) => {
  await page.goto('/gvteway/events/create');
  
  await page.fill('[name="name"]', 'Summer Festival');
  await page.fill('[name="venue"]', 'Central Park');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/gvteway\/events\/\w+/);
});
```

---

## Pull Request Process

### Before Creating PR

1. **Update from develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-branch
   git rebase develop
   ```

2. **Run tests**
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

3. **Update documentation**
   - Update relevant docs
   - Add API documentation if needed
   - Update CHANGELOG.md

### Creating PR

1. **Push your branch**
   ```bash
   git push origin feature/your-branch
   ```

2. **Create PR on GitHub**
   - Use descriptive title
   - Fill out PR template
   - Link related issues
   - Add screenshots for UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests added/updated
   - [ ] Integration tests added/updated
   - [ ] E2E tests added/updated
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No new warnings
   - [ ] Tests pass locally

   ## Screenshots (if applicable)
   
   ## Related Issues
   Closes #123
   ```

### Code Review

**As Author:**
- Respond to feedback promptly
- Make requested changes
- Re-request review after updates

**As Reviewer:**
- Review within 24 hours
- Be constructive and specific
- Approve only when ready for merge

### Merging

1. Ensure all checks pass
2. Get required approvals (minimum 1)
3. Squash and merge to develop
4. Delete feature branch

---

## Common Tasks

### Adding a New API Route

```bash
# 1. Create route file
touch src/app/api/your-route/route.ts

# 2. Implement handler
# See API Routes section above

# 3. Add tests
touch src/app/api/__tests__/your-route.test.ts

# 4. Update API documentation
# Edit docs/api/API_DOCUMENTATION.md
```

### Creating a New Component

```bash
# 1. Determine atomic level (atom/molecule/organism)
# 2. Create component file
touch src/components/molecules/YourComponent.tsx

# 3. Implement component
# See React Components section above

# 4. Export from index
# Add to src/components/molecules/index.ts
```

### Adding a Database Model

```bash
# 1. Update Prisma schema
# Edit prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name add_your_model

# 3. Generate client
npx prisma generate

# 4. Update types if needed
```

### Creating a Custom Hook

```bash
# 1. Create hook file
touch src/hooks/useYourHook.ts

# 2. Implement hook
export function useYourHook() {
  // Implementation
}

# 3. Add tests
touch src/hooks/__tests__/useYourHook.test.ts

# 4. Export from index
# Add to src/hooks/index.ts
```

### Debugging

**Development Tools:**

```bash
# View database
npx prisma studio

# Check types
npx tsc --noEmit

# Lint code
npm run lint

# Format code
npm run format
```

**Browser DevTools:**
- React DevTools
- Redux DevTools (if using)
- Network tab for API calls
- Console for errors

**VS Code Debugging:**

```json
// .vscode/launch.json
{
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

---

## Best Practices

### Performance

- Use React.memo for expensive components
- Implement proper loading states
- Use SWR for data fetching
- Optimize images with Next.js Image
- Lazy load components when appropriate

### Security

- Never commit secrets
- Validate all inputs
- Use parameterized queries (Prisma handles this)
- Implement proper authentication
- Follow OWASP guidelines

### Accessibility

- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast

### Code Organization

- Keep files focused and small
- Use barrel exports (index.ts)
- Group related functionality
- Follow consistent naming
- Document complex logic

---

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Database connection issues:**
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

**Module not found:**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**Type errors:**
```bash
# Regenerate Prisma types
npx prisma generate

# Check TypeScript config
npx tsc --showConfig
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev)

---

**Questions?** Contact the development team on Slack: #dev-support
