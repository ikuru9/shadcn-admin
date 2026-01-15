# AGENTS.md - Agent Coding Guide

This repository is a React 19 application built with Vite, TanStack Router, Valibot, and Shadcn UI. Follow these rules for all changes.

## Technology Stack

- **React 19** + **TypeScript** (strict mode)
- **Vite 7** for build tooling
- **TanStack Router** for routing
- **TanStack Query** + **TanStack Table** for data fetching
- **Zustand** for state management
- **Valibot** for validation (replaces Zod)
- **Shadcn UI** + **Radix UI** + **Tailwind CSS** for UI
- **Vitest** + **Testing Library** + **MSW** for testing
- **Axios** for HTTP client
- **date-fns** for date manipulation
- **Lucide React** for icons
- **React Hook Form** for form handling
- **Lefthook** for git hooks
- **oxlint** + **oxfmt** for code quality
- **commitizen** + **commitlint** for conventional commits

## Essential Commands

### Development Server

```bash
pnpm dev    # Start Vite dev server
```

### Build & Test Commands

```bash
pnpm run build     # Vite build + TypeScript check
pnpm run preview   # Preview production build
pnpm run test      # Run all Vitest tests (browser mode)
pnpm run generate  # Generate API client with Kubb
pnpm run commit    # Interactive conventional commit
```

### Running a Single Test File

```bash
# Run specific test file
pnpm test src/components/custom-input/date-picker.test.tsx

# Run test in watch mode
pnpm test src/components/custom-input/date-picker.test.tsx --watch

# Run tests matching pattern
pnpm test --run --reporter=verbose date-picker
```

### Code Quality & Formatting

```bash
pnpm lint          # Lint entire repo (oxlint)
pnpm fmt           # Format entire repo (oxfmt)
pnpm lint:staged   # Lint/formatted staged files (pre-commit)
pnpm fmt:staged    # Format staged files (pre-commit)
```

## Coding Guidelines

### Import/Export Patterns

- Use absolute path imports only: `@/*`
- Grouped imports (external → internal → relative)
- Clear exports (named exports preferred)
- Barrel exports in index.ts files
- "use client" directive for client components

### Naming Conventions

- Components: PascalCase(e.g., UserProfile)
- Hooks: camelCase with 'use' prefix(e.g., useUserProfile)
- Types: PascalCase(e.g., UserProfile)
- Interfaces: PascalCase without 'I' prefix(e.g., UserProfileProps)
- Constants: UPPER_SNAKE_CASE(e.g., MAX_RETRY_COUNT)
- Functions: camelCase(e.g., getUserProfile)
- Files: kebab-case(e.g., user-profile.tsx)
- Test files: .test.tsx(e.g., user-profile.test.tsx)

### TypeScript Patterns

- Strict mode with noUnusedLocals/noUnusedParameters
- Use type instead of interface
- Use generics
- Discriminated unions
- Type guard functions
- No any types - use unknown and narrow types (except in test files)
- Prefer named exports over default exports

### React Component Patterns

- Function components + hooks
- No forwardRef (React 19)
- CVA (class-variance-authority) for variants
- data-slot attributes for styling hooks
- Slot pattern from Radix UI for composition
- ref prop directly (not via forwardRef)
- React.ComponentProps<HTMLElement> for prop typing

### Styling Patterns

- Use cn() utility for class merging (clsx + tailwind-merge)
- Conditional styling with cn()
- Tailwind theme variables (text-primary, bg-accent, etc.)
- data-slot attributes for component styling
- Use Lucide React icons

### Error Handling Patterns

- try-catch with proper error types
- Valibot validation with error handling
- Axios error handling with custom utilities
- Error boundaries for React components

### Test Writing Patterns

- Vitest + Testing Library + MSW
- Extensive mocking (vi.mock)
- Test descriptions in Korean
- data-testid attributes for testing
- fireEvent and waitFor patterns

## Quick Start for Agents

### Project Setup

1. **Install deps:** `pnpm install`
2. **Run dev server:** `pnpm dev`
3. **Make changes** following patterns above
4. **Check linting:** `pnpm lint`
5. **Run tests:** `pnpm test`

## Important Restrictions

### Absolute Prohibitions

- **NO `npm` or `yarn`** - use `pnpm` only (enforced by engines)
- **NO `@ts-ignore` or `as any`** in production code (except test files)
- **NO bypassing git hooks** - they ensure code quality
- **NO git commits** - Never commit changes without explicit user request
- **NO direct style edits** to visual components - delegate to `frontend-ui-ux-engineer`
- **ALWAYS** use path aliases instead of relative imports (`@/*`)
- **ALWAYS** run `lsp_diagnostics` on changed files before completion

### Agent Delegation Guidelines

**Delegate to frontend-ui-ux-engineer (VISUAL CHANGES ONLY):**

- Changes related to style, className, tailwind, color, background, border, shadow, margin, padding, width, height, flex, grid, animation, transition, hover, responsive, font-size, icon, svg

**Handle directly (LOGIC CHANGES):**

- API calls, data fetching logic
- State management (Zustand/TanStack Query)
- Event handlers, form validation
- TypeScript type definitions
- Utility functions

**Delegate for special cases:**

- Complex architecture decisions → `oracle` agent
- External library issues → `librarian` agent
- Codebase exploration → `explore` agent
- Browser automation/testing → `playwright` skill
