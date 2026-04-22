# Testing Guide

When: Read when deciding test scope or validation commands.

- 기본 검증은 `pnpm typecheck`다.
- UI나 데이터 흐름이 바뀌면 `pnpm test`를 추가한다.
- 라우트, provider, API 계약이 바뀌면 `pnpm build`까지 확인한다.
- `src/routes/**` 테스트는 사용자가 명시적으로 요구한 경우에만 작성한다.
- 신규/수정 작업은 대응하는 단위 테스트 파일을 함께 계획한다.
- 테스트는 실제 동작을 검증해야 하며, mock 호출 자체만 검증하지 않는다.
- MSW는 로컬 개발과 테스트 검증용으로만 사용한다.
