# API Data Guide

When: Read before changing API contracts, generated clients, or state boundaries.

- 상태는 필요할 때만 분리한다.
- TanStack Query는 서버 상태, context와 Zustand는 앱 상태, form은 입력 상태로 본다.
- generated client 결과를 화면 모델로 바꾸는 위치를 명확히 둔다.
- TanStack Query, context provider, form 상태, generated client 소비부의 경계를 분명히 한다.
- API 계약이 바뀌면 생성 코드와 소비부를 함께 본다.
- `src/gen/` 아래 코드는 직접 수정하지 않는다.
- `kubb` 생성 결과, `src/gen/**`, 소비 코드, query hook, schema, 폼, mock handler가 같은 계약을 바라보는지 확인한다.
- optimistic update, loading, empty, error 상태를 함께 검토한다.
- 데이터 흐름을 바꿀 때는 소비부 단위 테스트 파일을 우선 계획한다.
- MSW는 로컬 개발과 테스트 검증용 보조 수단이다.
