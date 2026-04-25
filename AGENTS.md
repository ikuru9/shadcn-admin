# AGENTS

## Guides

- `docs/agent-guides/project-guide.md`: project structure, boundaries, and fixed constraints
- `docs/agent-guides/ui-routing-guide.md`: screens, interactions, layouts, and routes
- `docs/agent-guides/api-data-guide.md`: API contracts, generated clients, and data boundaries
- `docs/agent-guides/testing-guide.md`: test scope, exceptions, and validation commands
- `docs/agent-guides/planning-review-guide.md`: specs, plans, and review criteria
- `docs/agent-guides/hotspots-guide.md`: high-coupling or globally sensitive areas

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:

- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
