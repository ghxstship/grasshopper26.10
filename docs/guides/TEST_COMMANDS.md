# Quick Test Commands Reference

## 🧪 Unit & Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test Button.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="Button"

# Update snapshots (if using snapshot tests)
npm test -- -u
```

## 🌐 E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests in UI mode (interactive)
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run specific E2E test
npx playwright test homepage.spec.ts

# Run in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run with headed browser (see the browser)
npx playwright test --headed

# Generate test report
npx playwright show-report
```

## 🔄 Combined

```bash
# Run all tests (unit + E2E)
npm run test:all
```

## 📊 Coverage

Coverage reports are generated in `./coverage/` directory.
Open `./coverage/lcov-report/index.html` in a browser to view detailed coverage.

## 🐛 Debugging

```bash
# Debug Jest tests in VS Code
# 1. Set breakpoint in test file
# 2. Run "Jest: Debug" from command palette

# Debug Playwright tests
PWDEBUG=1 npx playwright test

# Run with Playwright Inspector
npx playwright test --debug
```

## 📝 Writing Tests

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive guide on writing tests.

Quick example:
```typescript
import { render, screen } from '@/test-utils/test-utils'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```
