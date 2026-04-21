# 작업 흐름

이 저장소의 기본 흐름은 다음 순서다.

1. `brainstorming`으로 요구사항과 범위를 정리한다.
2. `writing-plans`로 파일 단위 계획을 만든다.
3. `subagent-driven-development`로 역할별 작업을 분리한다.
4. 각 작업 뒤에는 `requesting-code-review`로 검토한다.
5. 마지막에 `pnpm typecheck`를 실행한다.
6. UI나 데이터 흐름 변경이 있으면 `pnpm test`를 추가로 실행한다.
7. 경로, 공급자, API 계약 변경이 있으면 `pnpm build`까지 확인한다.

## 원칙

- 가장 작은 수정부터 시작한다.
- 생성된 코드는 직접 수정하지 않는다.
- 검증 없이 완료했다고 말하지 않는다.
- 작업 중 새로 알게 된 제약, 함정, 고연결 지점처럼 이후 작업에도 영향을 주는 발견 사항은 `docs/agent-guides/hotspots-guide.md`에 기록한다.
