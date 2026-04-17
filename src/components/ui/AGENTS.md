# AGENTS.md - UI Components Guide

## OVERVIEW

This folder should follow shadcn's Base UI style: low-level, accessible UI primitives composed from `@base-ui/react/*` and styled with Tailwind.

## WHERE TO LOOK

- **Primitive source:** The accessibility and interaction model should come from `@base-ui/react/*` primitives.
- **Variants:** Visual variants belong in `class-variance-authority` (`cva`) definitions near the top of the file.
- **Styling hooks:** Use `data-slot` and Base UI state attributes such as `data-open`, `data-closed`, `data-side`, and `data-align` for styling.
- **Composition:** Prefer official Base UI subcomponents, `render` composition, and documented parent/child structure.

## CONVENTIONS

- **Base UI first:** Public interactive components in this folder should be built on Base UI primitives.
- **Primitive-typed props:** Prefer Base UI prop types such as `DialogPrimitive.Root.Props`, `MenuPrimitive.Item.Props`, or `SelectPrimitive.Trigger.Props`.
- **Render, not `asChild`:** Follow Base UI composition patterns and prefer `render` where composition is needed.
- **Strict prop spreading:** Pass `...props` through to the actual primitive/root element that owns accessibility and interaction behavior.
- **Slot contract:** Keep `data-slot` attributes on public building blocks.
- **Thin wrappers:** Keep wrappers minimal and focused on styling and small ergonomic improvements.
- **Stable exports:** Preserve established component export names and variant exports.

## BASE UI NOTES

- **Respect provider trees:** Child parts must remain inside the required Base UI parent context.
- **Use official structure:** If Base UI defines `Group`, `GroupLabel`, `Portal`, `Positioner`, `Popup`, or similar parts, compose them in the documented hierarchy.
- **Use Base UI state selectors:** Prefer Base UI-emitted data attributes over custom state classes when styling interactive states.
- **Prefer primitive behavior:** Do not reimplement keyboard, focus, dismissal, or ARIA behavior that the primitive already provides.

## CUSTOMIZATION TIPS

- **Add variants in `cva`:** Extend visual states in variant definitions instead of branching JSX when possible.
- **Merge classes with `cn()`:** Use `cn()` for caller overrides.
- **Follow shadcn Base UI patterns:** When modifying a component, align with the current shadcn Base UI registry structure and naming.
- **Keep icons incidental:** Icons should support the primitive, not define component behavior.

## ANTI-PATTERNS

- **NO non-Base-UI primitives for core interactive wrappers:** Do not introduce Radix or other primitive libraries into files that should follow shadcn Base UI.
- **NO broken composition:** Do not render subcomponents like labels, indicators, popups, or triggers outside the primitive structure they require.
- **NO business logic:** Keep feature logic, fetching, and domain state out of `src/components/ui`.
- **NO hardcoded colors:** Use theme tokens and semantic utility classes.
- **NO compatibility hacks:** If the primitive model differs from an older pattern, update the component to match Base UI rather than layering workarounds.
