# src/lib - AGENTS.md

- Shared helpers, client utilities, and small cross-cutting support code only.
- Reuse existing helpers before adding new ones.
- Keep side effects explicit, especially for cookies, toast, and requests.
- Do not put feature, route, or page-specific logic here.
- Guard `window` and `document` access for SSR.
