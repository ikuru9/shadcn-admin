# 아키텍처

이 저장소는 React 19, Vite, TanStack Router, TanStack Query, TanStack Table, TypeScript, Zod, Zustand, MSW를 중심으로 구성되어 있다.

- 라우트는 `src/routes/**`에 있다.
- 전역 provider는 `src/context/**`에 있다.
- 생성된 API 코드는 `src/gen/` 아래에 있다.
- 앱 전역 진입점과 provider 순서는 변경할 때 특히 조심한다.
- MSW는 로컬 개발과 테스트 검증용으로만 사용한다.
