# AGENTS.md - Users Feature

## OVERVIEW

Comprehensive user management feature providing searchable data tables, multi-action dialogs, and centralized state management.

## WHERE TO LOOK

- **Entry Point (`index.tsx`)**: Assembles the page layout using `Main` and `Header` components and wraps the feature in `UsersProvider`.
- **State Management (`components/users-provider.tsx`)**: The single source of truth for dialog visibility state (`invite` | `add` | `edit` | `delete`) and the currently selected `currentRow`.
- **Data Table (`components/users-table.tsx`)**: Implements the main display logic, utilizing `users-columns.tsx` for cell formatting and `data-table-row-actions.tsx` for row-level interactions.
- **Dialog Management (`components/users-dialogs.tsx`)**: A centralized container that renders all feature-specific dialogs (Add, Edit, Invite, Delete) based on the provider's state.
- **Schema & Types (`data/schema.ts`)**: Contains `Valibot` schemas for runtime validation and TypeScript type definitions for `User`, `UserRole`, and `UserStatus`.
- **Mock Data (`data/users.ts`)**: Currently serves as the data source for the user list; should be replaced with TanStack Query hooks in a production environment.

## CONVENTIONS

- **Centralized Context**: Always use the `useUsers()` hook to access and modify dialog states. This ensures consistency across the table, buttons, and row actions.
- **Dialog Workflow**: To open a dialog, call `setOpen('action_name')` and simultaneously set `setCurrentRow(user)` if the action requires specific row data (like 'edit' or 'delete').
- **Type Safety**: Strictly adhere to the types exported from `data/schema.ts`. Use `v.InferOutput<typeof userSchema>` to ensure types stay in sync with validation logic.
- **Component Isolation**: Dialogs are decoupled from the table rows. Row actions only trigger state changes in the provider, and the `UsersDialogs` component responds to those changes.
- **Route Integration**: Use TanStack Router's `useSearch()` and `useNavigate()` within `index.tsx` to handle table filtering and pagination via URL parameters.

## ANTI-PATTERNS

- **Prop Drilling**: Do not pass `isOpen` or `onClose` props to user-related dialogs through multiple component layers.
- **Local Dialog State**: Avoid using `useState(false)` for visibility within individual action buttons or table rows.
- **Hardcoded Constants**: Never hardcode user roles (`admin`, `cashier`, etc.) or statuses in components; use the union types from the schema.
- **Direct Data Imports**: Low-level UI components should not import `users` from `data/users.ts`. Data should flow down from `index.tsx` or be fetched via hooks.
- **Manual Validation**: Do not perform manual check-and-throw validation for user forms; use the `userSchema` with a validation library or form handler.
