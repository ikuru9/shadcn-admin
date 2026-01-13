# src/lib - AGENTS.md

## OVERVIEW

Shared utility functions and logic for common operations like cookie management, data formatting, and error handling.

## WHERE TO LOOK

- `utils.ts`: Contains the essential `cn()` utility for merging Tailwind classes with `clsx` and `tailwind-merge`. Also includes `sleep()` for artificial delays and `getPageNumbers()` for complex pagination logic.
- `cookies.ts`: Provides a zero-dependency implementation for browser cookie management. It includes `getCookie`, `setCookie`, and `removeCookie` using the native `document.cookie` API.
- `formatter.ts`: Centralizes data formatting logic. Currently focuses on date formatting using `date-fns` and project-wide format constants defined in `src/constants/format`.
- `handle-server-error.ts`: Exports a standardized `handleServerError` function that parses Axios errors and displays user-friendly toast notifications using `sonner`.
- `store.ts`: A custom state management utility based on `useSyncExternalStore`. It provides `createStore` and `useStore` hooks for lightweight, framework-agnostic state synchronization.
- `show-submitted-data.tsx`: A debugging helper that renders form submission data into a formatted JSON block within a toast message. Useful for rapid development and verification.

## CONVENTIONS

- **Native over Libraries**: When a task is simple (like cookie management), prefer a small native implementation over adding external dependencies to keep the bundle size small.
- **Pure and Testable**: Utility functions should be pure whenever possible. Avoid hidden side effects or reliance on global state outside of explicit parameters.
- **JSDoc Documentation**: Every exported function must include a JSDoc comment explaining its purpose, parameters, and return value. This improves IDE support and maintainability.
- **Absolute Imports**: Always use the `@/*` path alias when importing from other directories to maintain consistency with the root project settings.
- **Naming**: Use camelCase for functions and PascalCase for React-related store types or components (like `showSubmittedData`).

## ANTI-PATTERNS

- **Feature-Specific Logic**: Do not place business logic that belongs to a specific feature here. If it's not generic, it should live in `src/features`.
- **Circular Dependencies**: Never import from `src/components`, `src/features`, or `src/routes` to avoid complex dependency cycles.
- **Heavy Library Bloat**: Avoid importing large libraries (e.g., Lodash) just for one or two simple functions. Implement them manually if they are trivial.
- **Direct Style Edits**: While `cn()` merges classes, avoid placing hardcoded style values or complex CSS-in-JS logic here. Delegate styling to Tailwind or component files.
- **Implicit Global State**: Avoid utilities that rely on window or document without checking for their existence, especially for SSR compatibility.
