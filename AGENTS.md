# AGENTS.md

이 파일은 인덱스입니다.
현재 작업에 필요한 문서만 읽습니다.

## 읽기 원칙

- 한 번에 전체 문서를 읽지 않습니다.
- 작업과 직접 관련된 문서만 선택합니다.
- 추가 정보가 필요할 때만 다음 문서를 읽습니다.

## 규칙 적용 순서

1. 먼저 이 `AGENTS.md`를 읽습니다.
2. 작업 유형에 맞는 인덱스 문서를 읽습니다.
3. 수정 대상 경로에 더 가까운 하위 `AGENTS.md`가 있으면 추가로 읽고, 해당 범위에서는 그 규칙을 우선 적용합니다.
4. 인덱스 문서가 가리키는 세부 가이드 중 현재 작업에 직접 관련된 문서만 읽습니다.

## 하위 AGENTS 규칙

- 파일을 수정하기 전에, 대상 파일의 상위 디렉터리에 더 가까운 `AGENTS.md`가 있는지 확인합니다.
- 더 가까운 `AGENTS.md`는 해당 디렉터리 범위에서 루트 인덱스보다 구체적인 규칙으로 취급합니다.
- 예: `src/components/ui/*` 수정 시 `src/components/ui/AGENTS.md`를 함께 읽습니다.
- 예: `src/lib/*` 수정 시 `src/lib/AGENTS.md`를 함께 읽습니다.

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

- 구현/수정: `docs/agent-guides/coding-guidelines.md` (English coding guide index)
- 빌드/테스트: `docs/agent-guides/essential-commands.md` (English command reference)
- 기술 확인: `docs/agent-guides/technology-stack.md` (English stack overview)
- 절차 확인: `docs/agent-guides/quick-start.md` (English task checklist)
- 제한사항 확인: `docs/agent-guides/important-restrictions.md` (English restrictions index)

## 작업 유형별 필수 진입점

- React 컴포넌트, route, hook 구조 수정: `docs/agent-guides/coding/react-patterns.md`
- 타입, 제네릭, strict mode 오류 수정: `docs/agent-guides/coding/typescript-patterns.md`
- import/export 정리: `docs/agent-guides/coding/import-export.md`
- 테스트 작성 또는 수정: `docs/agent-guides/coding/test-writing.md`
- 하드 제한사항 확인: `docs/agent-guides/restrictions/prohibitions.md`
- 직접 처리 vs 위임 판단: `docs/agent-guides/restrictions/delegation-guidelines.md`

## 빠른 예시

- `src/routes/(auth)/sign-in.tsx` 수정:
  - 먼저 `AGENTS.md`
  - 다음 `docs/agent-guides/coding-guidelines.md`
  - 다음 `docs/agent-guides/coding/react-patterns.md`
  - 타입 변경이 있으면 `docs/agent-guides/coding/typescript-patterns.md` 추가
- `src/components/ui/input.tsx` 수정:
  - 먼저 `AGENTS.md`
  - 다음 `docs/agent-guides/coding-guidelines.md`
  - 다음 `src/components/ui/AGENTS.md`
  - React 구조 변경 시 `docs/agent-guides/coding/react-patterns.md` 추가

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
