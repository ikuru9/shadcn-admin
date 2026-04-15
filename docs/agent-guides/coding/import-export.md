# Import/Export Rules

## When to read

- When you need to organize import paths
- When you need guidance on export style or barrel exports

## Rules

- Use absolute path imports only: `@/*`
- Order imports as external → internal → relative
- Prefer named exports
- Use barrel exports in `index.ts`
- Add `"use client"` for client components when needed
