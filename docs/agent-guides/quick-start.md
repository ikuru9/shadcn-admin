# Quick Start

1. Read `AGENTS.md` and `docs/harness.md` first.
2. Inspect the affected route, provider, or generated client.
3. Make the smallest safe change.
4. Run `pnpm typecheck`.
5. If UI or data flow changed, run `pnpm test` and `pnpm build`.

Use the harness when the task touches UI, API integration, or validation.
Detailed behavior lives in `.claude/agents/`, `.claude/skills/`, and `docs/harness.md`.
