# Essential Commands

## When to read

- When you need to start the dev server
- When you need build, test, format, or lint commands

## Dev Server

```bash
pnpm dev
```

## Build and Test

```bash
pnpm run build
pnpm run preview
pnpm run test
pnpm run generate
pnpm run commit
```

## Run a Single Test

```bash
pnpm test src/components/custom-input/date-picker.test.tsx
pnpm test src/components/custom-input/date-picker.test.tsx --watch
pnpm test --run --reporter=verbose date-picker
```

## Code Quality

```bash
pnpm lint
pnpm fmt
pnpm lint:staged
pnpm fmt:staged
```

## Notes

- Do not use `npm` or `yarn`
- Use `pnpm` as the only package manager
