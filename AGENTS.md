# AGENTS

## 하네스: shadcn-admin

### **목표:**

- UI 변경, API 통합, 품질 검증을 분리해 반복 가능한 작업 흐름을 만든다.

### **트리거:**

- 이 저장소에서 기능 추가, 화면 수정, API 연동, 버그 수정, 검증 요청이 있으면 `.opencode/skills/harness-orchestrator/SKILL.md`를 사용하라.
- 단순 질문은 직접 응답 가능하다.

## 작업 방법

1. `AGENTS.md`와 `docs/harness.md`를 먼저 읽으세요.
2. UI, API 통합, 버그 수정 및 유효성 검사 작업에는 하네스 오케스트레이터를 사용하세요.
3. 역할별로 작업을 나누세요.

- `frontend` 역할: UI 및 상호 작용 변경
- `integrator` 역할: API, 생성된 코드, 상태 및 유효성 검사 연결
- `qa` 역할: 파일 간 및 경계 검사

4. 가장 작은 수정부터 시작하세요.
5. `pnpm typecheck`로 변경 사항을 검증한 후, 필요한 경우 `pnpm test`와 `pnpm build`를 실행하세요.

## 필수 규칙

- `src/gen/` 아래의 생성된 코드는 직접 수정하지 마세요.
- 경로, 공급자 또는 API 구조가 변경될 때 유효성 검사를 건너뛰지 마세요.
- 작업에 필수적인 파일이 아닌 이상 관련 없는 파일은 수정하지 마세요.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:

- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)

## 변경 이력

| 날짜       | 변경 내용                        | 대상                     | 사유                                                |
| ---------- | -------------------------------- | ------------------------ | --------------------------------------------------- |
| 2026-04-19 | 하네스 초기 통합                 | 전체                     | 작업 흐름 표준화                                    |
| 2026-04-19 | 역할 세분화 및 워크플로우 동기화 | `.opencode/*`            | 저장소 구조에 맞춰 에이전트 책임과 검증 흐름 구체화 |
| 2026-04-19 | AGENTS 단일 진입점으로 통합      | `AGENTS.md`, `CLAUDE.md` | 중복 진입점 제거                                    |
