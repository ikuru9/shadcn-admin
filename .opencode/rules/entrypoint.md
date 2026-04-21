# 진입 규칙

이 저장소에서 복합 작업을 시작할 때는 다음 순서를 따른다.

1. `AGENTS.md`를 먼저 읽는다.
2. 작업 성격에 맞는 `rules` 문서를 읽는다.
3. 필요하면 `context` 문서를 읽어 배경을 확인한다.
4. 구현 전에는 반드시 `writing-plans`를 먼저 실행한다.
5. `writing-plans` 이후에는 반드시 `plan-review`로 계획을 검토하고 정리한다.
6. 구현은 `test-driven-development`를 먼저 적용한다.
7. 구현은 `skills`를 사용해 분리한다.
8. 검토는 `checklists`를 기준으로 수행한다.

## 참조 우선순위

- 라우트, 화면, 상호작용: `rules/ui.md`, `rules/routing.md`
- 상태, 데이터 흐름, API 연동: `rules/data-flow.md`, `rules/api-integration.md`
- 검증, 접근성, 완료 기준: `rules/testing.md`, `rules/accessibility.md`
