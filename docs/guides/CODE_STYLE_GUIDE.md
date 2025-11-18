# Code Style Guide

**Version:** 1.0.0  
**Last Updated:** November 16, 2025

---

## TypeScript

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Components**: `PascalCase.tsx`
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`
- **Enums**: `PascalCase`

### Type Definitions

```typescript
// Prefer interfaces for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type for unions/intersections
type Status = 'pending' | 'approved' | 'rejected';
type UserWithRole = User & { role: string };

// Always type function returns
function getUser(id: string): Promise<User> {
  // ...
}

// Use generics for reusable code
function fetchData<T>(url: string): Promise<T> {
  // ...
}
```

---

## React Components

### Component Structure

```typescript
// 1. Imports
import React from 'react';
import { cn } from '@/lib/utils';

// 2. Types/Interfaces
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

// 3. Component
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
}) => {
  return (
    <button className={cn(/* ... */)}>
      {children}
    </button>
  );
};

// 4. Display name
Button.displayName = 'Button';
```

### Hooks Rules

- Always use hooks at top level
- Custom hooks start with `use`
- Include dependencies in useEffect

```typescript
function useData(id: string) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData(id).then(setData);
  }, [id]); // Include all dependencies
  
  return data;
}
```

---

## API Routes

### Route Structure

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 1. Extract parameters
    const { searchParams } = new URL(request.url);
    
    // 2. Validate input
    // 3. Call service
    // 4. Return response
    
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error message' },
      { status: 500 }
    );
  }
}
```

---

## Error Handling

```typescript
// Custom error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Try-catch blocks
try {
  await riskyOperation();
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation error
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
}
```

---

## Comments & Documentation

### JSDoc Comments

```typescript
/**
 * Fetches user by ID
 * 
 * @param id - User ID
 * @returns User object
 * @throws {NotFoundError} If user not found
 * 
 * @example
 * ```ts
 * const user = await getUser('123');
 * ```
 */
async function getUser(id: string): Promise<User> {
  // Implementation
}
```

### Inline Comments

```typescript
// Good: Explain WHY, not WHAT
// Retry 3 times because API is flaky
const maxRetries = 3;

// Bad: States the obvious
// Set max retries to 3
const maxRetries = 3;
```

---

## Testing

### Test Structure

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Reset state
  });

  describe('feature', () => {
    it('should do something', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = doSomething(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

---

## Git Commits

### Commit Messages

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(auth): add two-factor authentication
fix(api): resolve event filtering bug
docs(readme): update setup instructions
```

---

## Best Practices

1. **DRY**: Don't Repeat Yourself
2. **KISS**: Keep It Simple, Stupid
3. **YAGNI**: You Aren't Gonna Need It
4. **Single Responsibility**: One function, one purpose
5. **Immutability**: Prefer const, avoid mutations
6. **Error Handling**: Always handle errors
7. **Type Safety**: Use TypeScript strictly
8. **Testing**: Write tests for critical code
9. **Documentation**: Document complex logic
10. **Code Review**: Review all changes

---

For more details, see the full Developer Guide.
