# Project Guide

When: Read before starting work to understand project structure, constraints, and fixed boundaries.

- 이 저장소는 React 19, Vite, TanStack Router, TanStack Query, TanStack Table, TypeScript, Zod, Zustand, MSW를 중심으로 구성된다.
- 라우트는 `src/routes/**`에 있다.
- 전역 provider는 `src/context/**`에 있다.
- 생성된 API 코드는 `src/gen/` 아래에 있다.
- 생성된 코드는 직접 수정하지 않는다.
- route, provider, API 경계가 바뀌면 검증을 건너뛰지 않는다.
- 코드 파일을 수정한 뒤에는 `graphify update .`로 그래프를 갱신한다.
- MSW는 로컬 개발과 테스트 검증용으로만 사용한다.
