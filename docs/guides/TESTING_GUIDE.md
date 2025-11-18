# Testing Guide

> **Comprehensive testing strategy for the three-platform ecosystem**

---

## 🎯 Testing Philosophy

Our testing approach follows the **Testing Trophy** model:
- **70% Integration Tests** - Test how components work together
- **20% Unit Tests** - Test individual functions and components
- **10% E2E Tests** - Test critical user flows
- **Static Analysis** - TypeScript, ESLint for catching errors early

---

## 🛠️ Testing Stack

### Unit & Integration Testing
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **MSW (Mock Service Worker)** - API mocking

### E2E Testing
- **Playwright** - Browser automation
- **Multi-browser support** - Chrome, Firefox, Safari
- **Mobile testing** - iOS and Android viewports

### Coverage & Reporting
- **Jest Coverage** - Code coverage reports
- **Playwright HTML Reporter** - E2E test reports

---

## 📁 Test Organization

```
gvteway-atlvs/
├── src/
│   └── __tests__/
│       ├── utils/
│       │   ├── test-utils.tsx      # Custom render functions
│       │   └── mock-data.ts        # Mock data generators
│       ├── components/
│       │   ├── atoms/              # Atomic component tests
│       │   ├── molecules/          # Molecule component tests
│       │   └── organisms/          # Organism component tests
│       ├── lib/                    # Utility function tests
│       └── api/                    # API route tests
├── e2e/
│   ├── fixtures/                   # Test fixtures
│   ├── gvteway/                    # GVTEWAY E2E tests
│   ├── compvss/                    # COMPVSS E2E tests
│   └── atlvs/                      # ATLVS E2E tests
└── coverage/                       # Coverage reports (gitignored)
```

---

## 🚀 Running Tests

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="Button"
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run specific test file
npx playwright test homepage.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

### All Tests

```bash
# Run all tests (unit + E2E)
npm run test:all
```

---

## ✍️ Writing Tests

### Unit Test Example

```typescript
import { render, screen } from '@/__tests__/utils/test-utils'
import { Button } from '@/components/atoms/Button'
import userEvent from '@testing-library/user-event'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Integration Test Example

```typescript
import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import { EventList } from '@/components/gvteway/EventList'
import { mockEvents } from '@/__tests__/utils/mock-data'

describe('EventList Component', () => {
  it('displays list of events', async () => {
    render(<EventList events={mockEvents} />)
    
    await waitFor(() => {
      expect(screen.getByText(mockEvents[0].title)).toBeInTheDocument()
    })
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test.describe('Event Discovery Flow', () => {
  test('user can search and view event details', async ({ page }) => {
    await page.goto('/gvteway/events')
    
    // Search for event
    await page.fill('[data-testid="search-input"]', 'Concert')
    await page.click('[data-testid="search-button"]')
    
    // Verify results
    await expect(page.getByText('Concert')).toBeVisible()
    
    // Click on first result
    await page.click('[data-testid="event-card"]:first-child')
    
    // Verify event details page
    await expect(page).toHaveURL(/\/gvteway\/events\//)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
```

---

## 🎨 Testing Best Practices

### General Guidelines

1. **Test behavior, not implementation**
   - Focus on what users see and do
   - Avoid testing internal state or implementation details

2. **Write descriptive test names**
   ```typescript
   // ✅ Good
   it('displays error message when email is invalid')
   
   // ❌ Bad
   it('test email validation')
   ```

3. **Follow AAA pattern**
   - **Arrange** - Set up test data and conditions
   - **Act** - Perform the action being tested
   - **Assert** - Verify the expected outcome

4. **Keep tests independent**
   - Each test should run in isolation
   - Don't rely on test execution order

5. **Use data-testid sparingly**
   - Prefer semantic queries (role, label, text)
   - Use data-testid only when necessary

### Component Testing

1. **Test user interactions**
   ```typescript
   const user = userEvent.setup()
   await user.click(button)
   await user.type(input, 'text')
   ```

2. **Test accessibility**
   ```typescript
   expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
   expect(screen.getByLabelText('Email')).toBeInTheDocument()
   ```

3. **Test different states**
   - Loading states
   - Error states
   - Empty states
   - Success states

### API Testing

1. **Mock API calls**
   ```typescript
   import { rest } from 'msw'
   import { setupServer } from 'msw/node'
   
   const server = setupServer(
     rest.get('/api/events', (req, res, ctx) => {
       return res(ctx.json(mockEvents))
     })
   )
   ```

2. **Test error handling**
   ```typescript
   server.use(
     rest.get('/api/events', (req, res, ctx) => {
       return res(ctx.status(500))
     })
   )
   ```

### E2E Testing

1. **Test critical user flows**
   - User registration and login
   - Event discovery and ticket purchase
   - Production advancing workflow
   - Project management

2. **Use page objects for reusability**
   ```typescript
   class LoginPage {
     constructor(private page: Page) {}
     
     async login(email: string, password: string) {
       await this.page.fill('[name="email"]', email)
       await this.page.fill('[name="password"]', password)
       await this.page.click('[type="submit"]')
     }
   }
   ```

3. **Test across devices**
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

---

## 📊 Coverage Goals

### Minimum Coverage Thresholds

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Priority Areas (Aim for 90%+)

1. **Business Logic**
   - Payment processing
   - Ticket generation
   - Access control
   - Budget calculations

2. **Critical User Flows**
   - Authentication
   - Event booking
   - Advancing submissions
   - Project creation

3. **Utility Functions**
   - Date formatting
   - Price calculations
   - Validation functions

---

## 🐛 Debugging Tests

### Jest Debugging

```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Use VS Code debugger
# Add breakpoint and run "Jest: Debug"
```

### Playwright Debugging

```bash
# Run with headed browser
npx playwright test --headed

# Run with debug mode
npm run test:e2e:debug

# Use Playwright Inspector
PWDEBUG=1 npx playwright test
```

### Common Issues

1. **Tests timeout**
   - Increase timeout: `test.setTimeout(30000)`
   - Check for missing await statements

2. **Element not found**
   - Use `waitFor` for async operations
   - Check element visibility with `toBeVisible()`

3. **Flaky tests**
   - Add proper wait conditions
   - Use `waitForLoadState('networkidle')`
   - Avoid hard-coded delays

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 📚 Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

### Testing Patterns
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing)

---

## 🎯 Agent 8 Responsibilities

As the QA & Testing Engineer, maintain:

1. **Test Coverage**
   - Monitor coverage reports
   - Identify untested code paths
   - Write tests for new features

2. **Test Quality**
   - Review test code in PRs
   - Ensure tests follow best practices
   - Refactor flaky tests

3. **Documentation**
   - Keep this guide updated
   - Document testing patterns
   - Create testing examples

4. **CI/CD**
   - Maintain test pipelines
   - Fix failing tests
   - Optimize test performance

---

**Built with GHXSTSHIP precision ⚓️**
