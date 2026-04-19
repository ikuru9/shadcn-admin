# Harness Workflow

이 저장소의 기본 작업 흐름은 다음 순서다.

1. `AGENTS.md`를 읽고 하네스 규칙을 확인한다.
2. 오케스트레이터가 요청을 분해한다.
3. `frontend`가 화면과 상호작용을 수정한다.
4. `integrator`가 generated client, zod schema, React Query, mock 연동을 맞춘다.
5. `qa`가 경계면과 회귀를 확인한다.

권장 검증 순서:

1. `pnpm typecheck`
2. `pnpm test`
3. `pnpm build`

변경이 API 계약이나 생성 코드에 닿으면 `pnpm run generate`를 먼저 고려한다.
