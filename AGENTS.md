# AGENTS

## Project Workflow

이 저장소의 작업 흐름은 다음과 같다.

1. `AGENTS.md`를 확인한다.
2. 아키텍처나 코드베이스 질문에는 먼저 `graphify-out/GRAPH_REPORT.md`를 확인한다.
3. 작업 영역별 guide를 확인한다.
4. 필요하면 `docs/report`에 설계 또는 계획을 작성한다.
5. 구현한다.
6. 검토하고 검증한다.
7. 코드 파일을 수정한 뒤에는 `graphify update .`를 실행해 그래프를 갱신한다.

## Guides

- `docs/agent-guides/project-guide.md`: project structure, boundaries, and fixed constraints
- `docs/agent-guides/ui-routing-guide.md`: screens, interactions, layouts, and routes
- `docs/agent-guides/api-data-guide.md`: API contracts, generated clients, and data boundaries
- `docs/agent-guides/testing-guide.md`: test scope, exceptions, and validation commands
- `docs/agent-guides/planning-review-guide.md`: specs, plans, and review criteria
- `docs/agent-guides/hotspots-guide.md`: high-coupling or globally sensitive areas

## 필수 규칙

- `src/gen/` 아래의 생성된 코드는 직접 수정하지 않는다.
- 경로, 공급자 또는 API 구조가 변경될 때 유효성 검사를 건너뛰지 않는다.
- 작업에 필수적인 파일이 아닌 이상 관련 없는 파일은 수정하지 않는다.
