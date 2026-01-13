# AGENTS.md - Tasks Feature

## OVERVIEW

Task management feature with components and data layers for managing project tasks and tracking progress.

## WHERE TO LOOK

- `index.tsx`: Main feature entry point, responsible for the high-level layout and wrapping the feature in `TasksProvider`.
- `components/tasks-provider.tsx`: Context provider that manages shared state like dialog visibility and the currently active row.
- `components/tasks-table.tsx`: The primary data table component utilizing TanStack Table for sorting, filtering, and pagination.
- `components/tasks-dialogs.tsx`: A central component that orchestrates all task-related dialogs (Create, Import, Delete, Update).
- `components/tasks-columns.tsx`: Defines the table structure, including row selection, data mapping, and row-level actions.
- `components/tasks-mutate-drawer.tsx`: A shared drawer component used for both creating and updating task records.
- `data/schema.ts`: The source of truth for task data structures, using Valibot for runtime validation and type inference.
- `data/tasks.ts`: Contains mock data generation logic using Faker for development and testing.

## CONVENTIONS

- **Centralized State**: All dialog and drawer states must be managed via the `useTasks` hook provided by `TasksProvider`.
- **Row Context**: The `currentRow` state in `TasksProvider` should be used to track which task is being edited or deleted.
- **Type Safety**: Use `Task` type exported from `data/schema.ts` for all task-related props and variables.
- **Modal Transitions**: When closing a dialog that modifies `currentRow`, use a small timeout (e.g., 500ms) before nullifying `currentRow` to ensure smooth exit animations.
- **Action Buttons**: Primary feature actions (like "Add Task") should be placed in `TasksPrimaryButtons.tsx`.
- **Table Actions**: Row-specific actions (Edit, Delete, Duplicate) belong in `data-table-row-actions.tsx`.

## ANTI-PATTERNS

- **Local Dialog State**: Avoid using `useState` for dialog visibility within leaf components; always lift it to `TasksProvider`.
- **Hardcoded Options**: Do not hardcode status or priority options; derive them from the schema or a central constants file.
- **Prop Overload**: Avoid passing multiple task properties individually; pass the whole `task` object or use the `currentRow` context.
- **Direct Faker Usage**: Do not use Faker directly in components; keep mock generation logic within the `data/` directory.
- **Manual Routing for Modals**: Avoid using URL params for simple dialog states unless deep linking is explicitly required.
