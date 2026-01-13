# AGENTS.md - UI Components Guide

## OVERVIEW

Low-level, accessible UI primitives built with Radix UI and Tailwind CSS, following Shadcn patterns optimized for React 19.

## WHERE TO LOOK

- **Variant Definitions:** Located at the top of files using `class-variance-authority` (CVA). Look here to understand available `variant` and `size` options.
- **Accessibility/Logic:** Primarily handled by `@radix-ui/react-*` primitives. These handle keyboard navigation, focus management, and ARIA roles.
- **Styling Hooks:** Look for `data-slot` attributes on elements. These are used for targeted Tailwind styling from parent components or global styles.
- **Composition:** `asChild` prop implementation using Radix `Slot`. This allows passing all component props to a child element (e.g., using a `Link` as a `Button`).

## CONVENTIONS

- **React 19 Ref Handling:** DO NOT use `forwardRef`. In React 19, `ref` is a standard prop. Simply destructure `ref` from props or pass it through via `...props`.
- **Slot Pattern:** Every interactive element or major layout block should have a `data-slot="{component-name}"` attribute (e.g., `data-slot="button"`, `data-slot="card-content"`).
- **Strict Prop Spreading:** Always spread `...props` to the innermost primitive element. This ensures that native HTML attributes (like `id`, `title`, `aria-label`) and event handlers are correctly inherited.
- **Type Safety:** Use `React.ComponentProps<"tag">` for native HTML elements or `React.ComponentProps<typeof Primitive.Component>` for Radix-based components to ensure full type coverage.
- **Consistent Exports:** Always export both the component (e.g., `Button`) and its variant generator (e.g., `buttonVariants`). This enables consumers to style other elements with the same visual language.

## CUSTOMIZATION TIPS

- **Extending Variants:** When adding new visual states, modify the `cva` definition at the top of the file rather than adding conditional logic in the JSX.
- **Overriding Styles:** Use the `cn()` utility to merge default component classes with custom classes passed via the `className` prop. The `tailwind-merge` logic inside `cn()` will handle conflicts correctly.
- **Adding Icons:** Most components are designed to work with `lucide-react` icons. Use the `size-4` class for icons within buttons or inputs to match the established design language.

## ANTI-PATTERNS

- **NO forwardRef:** Avoid legacy `forwardRef` wrappers; they add unnecessary complexity in this React 19 codebase.
- **NO Business Logic:** These are pure design-system components. Do not perform API calls, manage complex domain state, or add side effects within these files.
- **NO Hardcoded Colors:** Never use hex codes, RGB, or HSL literals. Always use Tailwind theme variables (e.g., `text-primary`, `bg-accent/50`, `border-input`) to ensure dark mode and theme compatibility.
- **NO Breaking Composition:** Do not wrap the root element in a way that blocks `asChild` delegation or prevents `ref` from reaching the interactive element.
- **NO Manual ARIA:** Avoid manually adding ARIA roles or keyboard listeners. If the component lacks functionality, check if there is a Radix primitive that should be used instead.
