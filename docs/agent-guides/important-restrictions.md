# Important Restrictions

- Do not edit generated files in `src/gen/` by hand.
- Do not bypass `typecheck` when changing API shapes.
- Do not change provider order casually; `ThemeProvider`, `FontProvider`, and `DirectionProvider` affect app-wide behavior.
- Do not assume route changes are isolated; check router context and layout state.
- Do not add new abstractions unless they remove real duplication.
- Keep repo-level guidance concise; detailed execution rules belong in the harness files.
