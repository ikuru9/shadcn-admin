# UI Routing Guide

When: Read before changing screens, interactions, layouts, or routes.

- UI 변경은 기존 `shadcn-admin` 패턴을 우선 따른다.
- 상호작용은 단순한 구조로 유지한다.
- 데스크톱과 모바일에서 모두 깨지지 않게 본다.
- 폼, 테이블, 다이얼로그, 드로어는 기존 패턴을 우선 따른다.
- 접근성 없는 UI는 완료로 보지 않는다.
- 라우트 변경은 화면 구성과 상태 흐름에 미치는 영향을 먼저 본다.
- `src/routes/**`를 바꿀 때는 관련 provider, 레이아웃, 에러 화면, offline 흐름을 함께 확인한다.
- 경로 변경이 있으면 `pnpm typecheck`를 생략하지 않는다.
- 라우트 영향 범위가 넓으면 `pnpm build`까지 확인한다.
- `src/routes/**`는 테스트 기본 대상이 아니며, 테스트는 사용자가 명시적으로 요구한 경우에만 작성한다.
