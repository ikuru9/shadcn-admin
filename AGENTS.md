# AGENTS.md

이 파일은 인덱스입니다.
현재 작업에 필요한 문서만 읽습니다.

## 읽기 원칙

- 한 번에 전체 문서를 읽지 않습니다.
- 작업과 직접 관련된 문서만 선택합니다.
- 추가 정보가 필요할 때만 다음 문서를 읽습니다.

## 문서 목록

### 기술 확인

- `docs/agent-guides/technology-stack.md` — English guide for the project stack

### 명령어 확인

- `docs/agent-guides/essential-commands.md` — English guide for dev, build, test, and lint commands

### 코딩 규칙 확인

- `docs/agent-guides/coding-guidelines.md` — English index for coding rules

### 작업 절차 확인

- `docs/agent-guides/quick-start.md` — English quick checklist for common tasks

### 금지사항/위임 기준 확인

- `docs/agent-guides/important-restrictions.md` — English index for restrictions
- `docs/agent-guides/restrictions/prohibitions.md` — English list of hard restrictions
- `docs/agent-guides/restrictions/delegation-guidelines.md` — English delegation guide

## 작업별 추천

- 구현/수정: `coding-guidelines.md` (English coding guide index)
- 빌드/테스트: `essential-commands.md` (English command reference)
- 기술 확인: `technology-stack.md` (English stack overview)
- 절차 확인: `quick-start.md` (English task checklist)
- 제한사항 확인: `important-restrictions.md` (English restrictions index)

## 코딩 가이드 세부 문서

- `docs/agent-guides/coding/import-export.md`
- `docs/agent-guides/coding/naming-conventions.md`
- `docs/agent-guides/coding/typescript-patterns.md`
- `docs/agent-guides/coding/react-patterns.md`
- `docs/agent-guides/coding/styling-patterns.md`
- `docs/agent-guides/coding/error-handling.md`
- `docs/agent-guides/coding/test-writing.md`
- `docs/agent-guides/restrictions/prohibitions.md`
- `docs/agent-guides/restrictions/delegation-guidelines.md`

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
