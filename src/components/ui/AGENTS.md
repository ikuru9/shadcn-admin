# AGENTS.md - UI Components Guide

## Rule Set

- No edits without explicit user approval.
- Keep components low-level, accessible, and composable.
- Use `@base-ui/react/*` when the component already has a matching primitive.
- Keep shadcn-style wrappers thin and consistent with existing files.
- Put variants in `cva`, styling in Tailwind, and state hooks in `data-slot` / Base UI attrs.
- Prefer `render` composition and strict prop spreading over custom wrappers.
- Preserve existing export names and parent/child structure.

## Do

- Use primitive prop types where possible.
- Keep `useRender`, `mergeProps`, and `cn()` close to the component that needs them.
- Align edits with the current registry structure and naming.

## Don't

- Add business logic, fetching, or domain state here.
- Reimplement keyboard, focus, dismissal, or ARIA behavior.
- Introduce Radix or other primitive libraries into Base UI wrappers.
- Use hardcoded colors or compatibility hacks.
