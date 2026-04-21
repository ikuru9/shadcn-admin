# 작업 흐름

이 저장소의 기본 흐름은 다음 순서다.

1. `brainstorming`으로 요구사항과 범위를 정리한다.
2. `writing-plans`로 파일 단위 계획을 만든다.
3. `plan-review`로 계획을 검토하고 정리한다.
4. `test-driven-development`로 구현을 시작한다.
5. `subagent-driven-development`로 역할별 작업을 분리한다.
6. 각 작업 뒤에는 `requesting-code-review`로 검토한다.
7. 마지막에 `pnpm typecheck`를 실행한다.
8. UI나 데이터 흐름 변경이 있으면 `pnpm test`를 추가로 실행한다.
9. 경로, 공급자, API 계약 변경이 있으면 `pnpm build`까지 확인한다.

## 원칙

- 가장 작은 수정부터 시작한다.
- 신규 작업과 수정 작업 모두 구현 전에 반드시 `writing-plans`를 거친다.
- `writing-plans` 다음에는 반드시 `plan-review`를 거친다.
- 신규 작업과 수정 작업 모두 `test-driven-development` 방법론으로 진행한다.
- 생성된 코드는 직접 수정하지 않는다.
- 검증 없이 완료했다고 말하지 않는다.
- 작업 중 새로 알게 된 제약, 함정, 고연결 지점처럼 이후 작업에도 영향을 주는 발견 사항은 `docs/agent-guides/hotspots-guide.md`에 기록한다.
