# Authenticated Route Authorization Plan

## Goal

`src/routes/_authenticated/` 아래는 권한이 있는 사용자만 접근 가능하게 만들고, 권한은 `/auth/menus` / `/auth/menus/{menuKey}` 로 검증한다.

## Constraints / decisions

- `/auth/menus` 는 로그인 시 1회 호출한다.
- 이후에는 메모리 기준으로만 1시간 stale check 를 한다. 새로고침하면 다시 호출된다.
- 페이지 이동 시 호출 대상은 **route file 이 바뀔 때만**이다. query/param 변경은 제외한다.
- 권한 없음은 `/(errors)/403` 로 보낸다.
- `menuKey` 는 각 route file 의 metadata/static data 에 직접 둔다.

## Plan

### 1) Protected route inventory + `menuKey` 부여

**Files**

- `src/routes/_authenticated/**` 내 나머지 leaf route files

**Work**

- 각 보호 대상 route file 에 `menuKey` 를 추가한다.
- backend 의 `/auth/menus/{menuKey}` 와 동일한 key 를 사용한다.
- route group/layout route 는 필요 시 parent-level guard 만 두고, 실제 메뉴 검증은 leaf route 에 둔다.

### 2) Auth menu session lifecycle 정리

**Files**

- `src/stores/auth-store.ts`
- `src/stores/auth-store.test.ts` (new or extended)

**Work**

- `setAccessToken()` 에서 지금처럼 `/auth/menus` preload 를 유지한다.
- 메모리용 last-fetch timestamp 와 hourly refresh handle 을 추가한다.
- 로그인 시 refresh cycle 을 시작하고, 로그아웃/reset 시 반드시 clear 한다.
- 1시간 stale 상태이면 `getMyMenusQueryOptions()` 를 다시 `ensureQueryData` 하도록 만든다.
- 새로고침 시 메모리가 초기화되므로 자동으로 다시 fetch 되도록 유지한다.

### 3) Route guard 도입

**Files**

- `src/routes/_authenticated/route.tsx`
- `src/routes/_authenticated/*` 각 protected route file
- 필요 시 `src/routes/_authenticated/auth-guard.ts` (new)

**Work**

- `/_authenticated` root 에서는 로그인 상태/세션 존재 여부를 1차로 확인한다.
- 각 leaf route 는 자기 `menuKey` 로 `/auth/menus/{menuKey}` 를 호출/확인한다.
- 권한 없음(403) 이면 `/(errors)/403` 로 redirect 한다.
- 동일 route file 안에서 query/param 만 바뀌는 경우는 재검증하지 않는다.

### 4) 403 UX 정합성 확인

**Files**

- `src/routes/(errors)/403.tsx`
- `src/routes/_authenticated/errors/$error.tsx`
- `src/routes/_authenticated/errors/components/forbidden-error.tsx`

**Work**

- canonical denied destination 은 `/(errors)/403` 로 통일한다.
- 기존 authenticated error 화면은 다른 에러 경로용으로 유지한다.
- 현재 query-level 403 처리와 충돌하지 않게 route-level redirect 를 우선한다.

### 5) Validation

**Commands**

- `pnpm vitest run src/stores/auth-store.test.ts`
- `pnpm vitest run` (추가한 guard/store tests 포함)
- `pnpm typecheck`
- `pnpm build`
- `graphify update .`

## Acceptance criteria

- 로그인 시 `/auth/menus` 가 1회 로드된다.
- 로그인 후 메모리 기준 1시간마다 메뉴 캐시가 갱신된다.
- protected route file 들에 `menuKey` 가 정의된다.
- route file 변경 시 `/auth/menus/{menuKey}` 권한 확인이 실행된다.
- 권한 없는 접근은 `/(errors)/403` 로 이동한다.
- typecheck/build 가 통과한다.

## Self-review

- 범위가 `src/routes/_authenticated/` 와 auth session lifecycle 로 제한되어 있는가?
- generated code (`src/gen/**`) 를 수정하지 않는가?
- route change / query change 를 구분하는 조건이 명확한가?
- 테스트와 검증 명령이 포함되어 있는가?
