---
trigger: always_on
description: when working for testing or coverage.
---

# Test Guide

## Overview

Testing stack:
- Vitest (unit/integration)

## Quick Commands

### Run All Tests
```bash
# All tests
pnpm run test
```

### Coverage
```bash
# Web
pnpm run test --coverage
```

## Web Testing (Vitest)

### Configuration
See `vite.config.ts`.

### File Patterns
- Unit tests: `**/*.test.{ts,tsx}`
- Integration tests: `**/*.spec.{ts,tsx}`

### Example Unit Test
```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });
});
```

### Example Component Test
```typescript
// src/components/button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

### Mocking
```typescript
import { vi } from 'vitest';

// Mock module
vi.mock('@/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock function
const mockFn = vi.fn().mockResolvedValue({ data: 'test' });
```

## CI Testing

GitHub Actions runs tests on every PR:

```yaml
- name: Test
  run: pnpm run test
```

## Best Practices

### Test Organization
- One test file per source file
- Group related tests with `describe`/`group`
- Use descriptive test names

### Mocking
- Mock external dependencies (APIs, databases)
- Don't mock what you're testing
- Reset mocks between tests

### Assertions
- One logical assertion per test
- Use specific matchers (`toHaveTextContent` vs `toContain`)
- Test behavior, not implementation

### Coverage
- Aim for 80%+ coverage on critical paths
- Don't chase 100% - focus on meaningful tests
- Coverage != quality
